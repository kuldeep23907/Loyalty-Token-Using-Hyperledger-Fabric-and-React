const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const nodeschedule = require('node-schedule');
const network = require('../network.js');

const adapter = new FileSync('./schedule.json');
const db = lowdb(adapter);
db.defaults({ schedules: [] }).write();
const scheduleJobs = {};

async function startSurvey(department, createdAt) {
    const networkObj = await network.connect(true, process.env.ADMIN);
    const contractRes = await network.invoke(networkObj, 'start', department, createdAt);

    const error = networkObj.error || contractRes.error;
    if (error) {
        console.log(error);
    } else {
        console.log(`Survey ${department}.${createdAt} start!!`);
    }
}

async function finishSurvey(department, createdAt, surveyInfoKey) {
    const networkObj = await network.connect(true, process.env.ADMIN);
    const contractRes = await network.invoke(networkObj, 'finish', department, createdAt);

    const error = networkObj.error || contractRes.error;
    if (error) {
        console.log(error);
    } else {
        console.log(`Survey ${department}.${createdAt} finish!!`);
    }

    db.get('schedules')
        .remove({ key: surveyInfoKey })
        .write();
    console.log(`Survey ${department}.${createdAt} removed!!`);
}

function reserveSurveyDate(surveyInfo) {
    const { department, createdAt, key } = surveyInfo;
    const schedule = {};

    const startDate = new Date(parseInt(surveyInfo.startDate, 10));
    schedule.start = nodeschedule.scheduleJob(startDate, () => {
        startSurvey(department, createdAt);
    });
    if (!schedule.start) {
        startSurvey(department, createdAt);
    }

    const finishDate = new Date(parseInt(surveyInfo.finishDate, 10));
    schedule.finish = nodeschedule.scheduleJob(finishDate, () => {
        finishSurvey(department, createdAt, key);
    });
    if (!schedule.finish) {
        finishSurvey(department, createdAt, key);
    }

    console.log(`Reserve survey schedule successly: ${key}`);
    return schedule;
}

function cancelSurveySchedule(scheduleJob) {
    if (scheduleJob.start) {
        scheduleJob.start.cancel();
    }
    if (scheduleJob.finish) {
        scheduleJob.finish.cancel();
    }
    console.log('Cancel survey schedule successly');
}

exports.initSurveySchedule = () => {
    const surveyInfos = db.get('schedules').value();

    surveyInfos.forEach(surveyInfo => {
        console.log(`Survey schedule : ${surveyInfo.key}`);
        const schedule = reserveSurveyDate(surveyInfo);
        if (schedule.start || schedule.finish) {
            scheduleJobs[surveyInfo.key] = schedule;
        }
    });
    console.log('Finished initialize survey schedule.');
};

exports.addSurveySchedule = surveyInfoBuffer => {
    const surveyInfo = JSON.parse(surveyInfoBuffer);
    console.log(`Add survey schedule: ${surveyInfo.key}`);

    const schedule = reserveSurveyDate(surveyInfo);
    if (schedule.start || schedule.finish) {
        scheduleJobs[surveyInfo.key] = schedule;
        db.get('schedules')
            .push(surveyInfo)
            .write();
    }
};

exports.updateSurveySchedule = surveyInfoBuffer => {
    const surveyInfo = JSON.parse(surveyInfoBuffer);
    console.log(`Update survey schedule: ${surveyInfo.key}`);

    const schedule = scheduleJobs[surveyInfo.key];
    cancelSurveySchedule(schedule);

    const newSchedule = reserveSurveyDate(surveyInfo);
    if (newSchedule.start || newSchedule.finish) {
        scheduleJobs[surveyInfo.key] = newSchedule;
        db.get('schedules')
            .find({ key: surveyInfo.key })
            .assign(surveyInfo)
            .write();
    } else {
        delete scheduleJobs[surveyInfo.key];
        db.get('schedules')
            .remove({ key: surveyInfo.key })
            .write();
    }
};

exports.removeSurveySchedule = surveyInfoBuffer => {
    const surveyInfo = JSON.parse(surveyInfoBuffer);
    console.log(`Remove survey schedule: ${surveyInfo.key}`);

    const schedule = scheduleJobs[surveyInfo.key];
    cancelSurveySchedule(schedule);
    delete scheduleJobs[surveyInfo.key];
    db.get('schedules')
        .remove({ key: surveyInfo.key })
        .write();
};

exports.scheduleJobs = scheduleJobs;
