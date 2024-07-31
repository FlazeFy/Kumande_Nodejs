const connection = require('../../../configs/configs')
const { generateQueryMsg, generateTranslate, getMonthName } = require('../../../packages/helpers/generator')
const baseTable = 'consume'
const fs = require('fs')
const csv = require('csv-parser')
const { templateSelectObjectColumn } = require('../../../packages/helpers/template')
const { calculateDistance } = require('../../../packages/helpers/ocnverter')
const { getStatusSodium, getStatusSugar, getStatusCarbohydrates, getStatusDietaryFiber, getStatusSaturatedFats } = require('../../../packages/utils/business/analyze')

function getAnalyzeConsume(req, res, userId, lat, long, date){
    // Query CSV
    try {
        const csvFilePath = './docs/Kumande Asset - Food.csv'

        const sqlCheckUser = `SELECT 1 FROM user WHERE id = '${userId}' LIMIT 1`

        connection.query(sqlCheckUser, (err, check, fields) => {
            if (err) {
                res.status(500).send({
                    message: 'Internal server error',
                    status: 'failed'
                });
            } else {
                if(check.length > 0){
                    // Attribute
                    const dateObj = new Date(date)
                    const month = getMonthName(dateObj.getMonth()).substring(0,3)
                    const year = dateObj.getFullYear()

                    // Query DB SQL
                    const selectProvide = templateSelectObjectColumn('consume_detail', 'provide', 'provide')
                    const selectLat = templateSelectObjectColumn('consume_detail', 'provide_lat', 'consume_lat')
                    const selectLong = templateSelectObjectColumn('consume_detail', 'provide_long', 'consume_long')

                    const selectMonth = templateSelectObjectColumn('budget_month_year', 'month', 'month').replace(' AS month','')
                    const selectYear = templateSelectObjectColumn('budget_month_year', 'year', 'year').replace(' AS year','')

                    const sqlConsume = `SELECT 
                            consume_name, AVG(CAST(REPLACE(JSON_EXTRACT(consume_detail, '$[0].calorie'), '\"', '') AS UNSIGNED)) as calorie, COUNT(1) as total_consume, 
                            is_favorite, ${selectProvide}, ${selectLat}, ${selectLong}
                        FROM ${baseTable}
                        WHERE deleted_by is null
                        AND created_by = '${userId}'
                        GROUP BY consume_name
                        ORDER BY total_consume DESC
                    `

                    const sqlBudget = `SELECT budget_total
                        FROM budget
                        WHERE created_by = '${userId}'
                        AND ${selectMonth} = '${month}'
                        AND ${selectYear} = '${year}'
                    `

                    const sqlAllergic = `SELECT allergic_context
                        FROM allergic
                        WHERE created_by = '${userId}'
                    `
                    
                    let bValues = []
                    let cValues = []

                    fs.createReadStream(csvFilePath).pipe(csv())
                    .on('data', (row) => {
                        bValues.push(row['food']);
                        cValues.push(row['calorie']);
                    })
                    .on('end', () => {
                        connection.query(sqlConsume, (err, rows, fields) => {
                            if (err) {
                                res.status(500).send({
                                    message: 'Internal server error',
                                    status: 'failed'
                                })
                            } else {
                                let code = 200

                                connection.query(sqlAllergic, (err, allergic, fields) => {
                                    if (err) {
                                        res.status(500).send({
                                            message: 'Internal server error',
                                            status: 'failed'
                                        });
                                    } else {
                                        // Allergic List
                                        const allergicContext = allergic.flatMap(entry => 
                                            entry.allergic_context.split(',').map(dt => dt.trim().toLowerCase())
                                        );

                                        // Suggestion from Dataset
                                        const results_dataset = bValues.map((food, index) => ({
                                            consume_name: food,
                                            calorie: parseInt(cValues[index])
                                        })).filter(item => 
                                            !allergicContext.some(dt => item.consume_name.toLowerCase().includes(dt))
                                        )

                                        // Suggestion from Consume History
                                        const results_personal = rows.map((dt, index) => ({
                                            consume_name: dt.consume_name,
                                            calorie: dt.calorie,
                                            total_consume: dt.total_consume,
                                            is_favorite: dt.is_favorite,
                                            provide: dt.provide,
                                            distance: dt.consume_lat && dt.consume_long && lat && long ? calculateDistance(dt.consume_lat, dt.consume_long, lat, long) : null,
                                        })).filter(item => 
                                            !allergicContext.some(dt => item.consume_name.toLowerCase().includes(dt))
                                        )

                                        if (rows.length == 0 && results_dataset.length == 0){
                                            code = 404
                                        }
                                        
                                        connection.query(sqlBudget, (err, budget, fields) => {
                                            let budgetTotal = null
                                            if (err) {
                                                res.status(500).send(err);
                                            } else {
                                                // Budget by Month
                                                if (budget.length > 0) {
                                                    budgetTotal = budget[0].budget_total
                                                }
                        
                                                res.status(code).json({ 
                                                    message: generateQueryMsg(baseTable, rows.length), 
                                                    status: code, 
                                                    general_analyze: results_dataset,
                                                    personal_analyze: results_personal,
                                                    budget_total: budgetTotal
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    })
                    .on('error', (err) => {
                        res.status(500).send({
                            message: 'Internal server error',
                            status: 'failed'
                        });
                    });
                } else {
                    res.status(404).send({
                        message: 'User not found',
                        status: 'failed'
                    });
                }
            }
        })
    } catch (err) {
        res.status(500).send({
            message: 'Internal server error',
            status: 'failed'
        });
    }
}

function getAnalyzeConsumeMyBodyRelation(req, res, userId, blood_pressure, blood_glucose, calorieDaily, weight, height, date, gout){
    // Query CSV
    try {
        const csvFilePath = './docs/Kumande Asset - Food.csv'

        const sqlCheckUser = `SELECT gender FROM user WHERE id = '${userId}' LIMIT 1`

        connection.query(sqlCheckUser, (err, check, fields) => {
            if (err) {
                res.status(500).send({
                    message: 'Internal server error',
                    status: 'failed'
                });
            } else {
                if(check.length > 0){
                    const sqlConsume = `SELECT 
                            consume_name, CAST(REPLACE(JSON_EXTRACT(consume_detail, '$[0].calorie'), '\"', '') AS UNSIGNED) as calorie
                        FROM ${baseTable}
                        WHERE deleted_by is null
                        AND created_by = '${userId}'
                    `
                    const sqlAllergic = `SELECT allergic_context
                        FROM allergic
                        WHERE created_by = '${userId}'
                    `

                    const sqlConsumeCal = `SELECT SUM(CAST(REPLACE(JSON_EXTRACT(consume_detail, '$[0].calorie'), '\"', '') AS UNSIGNED)) as total_calorie
                        FROM ${baseTable}
                        WHERE DATE(created_at) = '${date}' 
                        AND created_by = '${userId}'
                    `

                    // BMI Status (Source : CDC)
                    const gender = check[0].gender
                    let bmi
                    if(gender == 'male'){
                        bmi = weight / ((height / 100) * (height / 100))
                    } else if(gender == 'female'){
                        bmi = weight / ((height / 100) * (height / 100))
                    }

                    const bmi_status = bmi >= 30.0 ? 'Obesity' : 
                        bmi >= 25.0 ? 'Overweight':
                        bmi >= 18.5 ? 'Healthy Weight':
                            'Underweight'

                    // Blood Preasure (Source : https://www.health.harvard.edu/heart-health/reading-the-new-blood-pressure-guidelines)
                    // Get blood preasure status
                    const blood_pressure_split = blood_pressure.split('/')
                    systolic = blood_pressure_split[0]
                    diastolic = blood_pressure_split[1]

                    const systolic_status = systolic > 140 ? 'High' :
                        systolic > 120 ? 'Pre-High' :
                        systolic > 90 ? 'Normal' : 'Low'

                    const diastolic_status = diastolic > 90 ? 'High' :
                        diastolic > 80 ? 'Pre-High' :
                        diastolic > 60 ? 'Normal' : 'Low'

                    // Glucose Status : Fasting (Source : CDC)
                    const glucose_status = blood_glucose >= 126 ? 'Diabetes' :
                    blood_glucose >= 100 ? 'Prediabetes' :
                    blood_glucose >= 70 ? 'Normal' :
                        'Low'

                    // Gout Status : Fasting (Source : https://www.medicalnewstoday.com/articles/uric-acid-level)
                    const gout_status = 
                        gender == 'male' ?
                        gout > 7.0 ? 'High' :
                            gout >= 2.5 ? 'Normal' :
                            'Low'
                    : gender == 'female' ?
                        gout > 6.0 ? 'High' :
                        gout >= 1.5 ? 'Normal' :
                        'Low' : ''
                    
                    let cellFoodValues = []
                    let cellCalValues = []
                    let cellSodiumValues = []
                    let cellSugarValues = []
                    let cellCarbohydrateValues = []
                    let cellDietaryFiberValues = []
                    let cellDietarySaturatedFats = []

                    fs.createReadStream(csvFilePath).pipe(csv())
                    .on('data', (row) => {
                        cellFoodValues.push(row['food'])
                        cellCalValues.push(row['calorie'])
                        cellSodiumValues.push(row['sodium'])
                        cellSugarValues.push(row['sugar'])
                        cellCarbohydrateValues.push(row['carbohydrates'])
                        cellDietaryFiberValues.push(row['dietary_fiber'])
                        cellDietarySaturatedFats.push(row['saturated_fats'])
                    })
                    .on('end', () => {
                        connection.query(sqlConsume, (err, rows, fields) => {
                            if (err) {
                                res.status(500).send({
                                    message: 'Internal server error',
                                    status: 'failed'
                                })
                            } else {
                                let code = 200

                                connection.query(sqlAllergic, (err, allergic, fields) => {
                                    connection.query(sqlConsumeCal, (errCal, consumeCal, fields) => {
                                        if (err) {
                                            res.status(500).send({
                                                message: 'Internal server error',
                                                status: 'failed'
                                            });
                                        } else {
                                            // Allergic List
                                            const allergicContext = allergic.flatMap(entry => 
                                                entry.allergic_context.split(',').map(dt => dt.trim().toLowerCase())
                                            );

                                            // Total Daily Calorie
                                            let totalConsumedCalorie = 0
                                            if(consumeCal){
                                                totalConsumedCalorie = consumeCal[0].total_calorie
                                            } 

                                            // Sodium exception food
                                            let exception_sodium_status = []
                                            let param_sodium = ''
                                            if(systolic_status == "High" || systolic_status == "Pre-High"){
                                                exception_sodium_status = ['Very Low','Low']
                                                param_sodium = 'We suggest you to consume food where the sodium is below 0.14 g mg per 100 g'
                                            } else {
                                                param_sodium = 'So you can consume whatever the sodium level is'
                                            }

                                            // Sugar exception food
                                            let exception_sugar_status = []
                                            let param_sugar = ''
                                            if(glucose_status == "High" || glucose_status == "Pre-High"){
                                                exception_sugar_status = ['Very Low','Low']
                                                param_sugar = 'We suggest you to consume food where the sugar is below 5 g mg per 100 g'
                                            } else {
                                                param_sugar = 'So you can consume whatever the sugar level is. We suggest you sometimes consume high value sugar to make sure your sugar level is not below the lowest parameter'
                                            }

                                            // Gout exception food
                                            let exception_saturated_fats_status = []
                                            let param_saturated_fats = ''
                                            if(gout_status == "High" || gout_status == "Pre-High"){
                                                exception_gout_status = ['Very Low','Low']
                                                param_saturated_fats = 'We suggest you to consume food where the saturated fats is below 5 g mg per 100 g'
                                            } else {
                                                param_saturated_fats = 'So you can consume whatever the saturated fats level is. We suggest you sometimes consume high value saturated fats to make sure your gout level is not below the lowest parameter'
                                            }

                                            // Food allowed passed calorie based on BMI status
                                            let is_calorie_over
                                            if(bmi_status == 'Overweight' || bmi_status == 'Obesity'){
                                                is_calorie_over = false
                                            } else if(bmi_status == 'Healthy Weight' || bmi_status == 'Underweight'){
                                                is_calorie_over = true
                                            }

                                            // Suggestion from Dataset
                                            let filteredAllergic = cellFoodValues.map((food, index) => ({
                                                consume_name: food,
                                                calorie: parseInt(cellCalValues[index]),
                                                sodium: parseFloat(cellSodiumValues[index]),
                                                sodium_status: getStatusSodium(parseFloat(cellSodiumValues[index])),
                                                sugar: parseFloat(cellSugarValues[index]),
                                                sugar_status: getStatusSugar(parseFloat(cellSugarValues[index])),
                                                carbohydrate: parseFloat(cellCarbohydrateValues[index]),
                                                carbohydrate_status: getStatusCarbohydrates(parseFloat(cellCarbohydrateValues[index])),
                                                dietary_fiber: parseFloat(cellDietaryFiberValues[index]),
                                                dietary_fiber_status: getStatusDietaryFiber(parseFloat(cellDietaryFiberValues[index])),
                                                saturated_fats: parseFloat(cellDietarySaturatedFats[index]),
                                                saturated_fats_status: getStatusSaturatedFats(parseFloat(cellDietarySaturatedFats[index]))
                                            })).filter(item => 
                                                !allergicContext.some(dt => item.consume_name.toLowerCase().includes(dt))
                                            )

                                            // Calorie measure
                                            let filteredCalorie = filteredAllergic
                                            if(is_calorie_over){
                                                filteredCalorie = filteredCalorie.sort((a, b) => b.calorie - a.calorie)
                                            } else {
                                                filteredCalorie = filteredCalorie.filter(item => 
                                                    item.calorie < calorieDaily)
                                            }

                                            let filteredCalorieDaily = filteredCalorie.filter(item => 
                                                    item.calorie < (calorieDaily - totalConsumedCalorie))

                                            // Analyze for blood preasure
                                            const results_dataset_blood_preasure = filteredCalorieDaily.filter(item => 
                                                exception_sodium_status.includes(item.sodium_status))
                                                .map(({ sugar, sugar_status, carbohydrate, carbohydrate_status, dietary_fiber, dietary_fiber_status, saturated_fats, saturated_fats_status, ...rest }) => rest)

                                            //  Analyze for glucose
                                            let results_dataset_glucose
                                            if(exception_sugar_status.length > 1){
                                                results_dataset_glucose = filteredCalorieDaily.filter(item => 
                                                    exception_sugar_status.includes(item.sugar_status))
                                                    .map(({ sodium, sodium_status, saturated_fats, saturated_fats_status, ...rest }) => rest)
                                            } else {
                                                results_dataset_glucose = filteredCalorieDaily
                                                    .map(({ sodium, sodium_status, saturated_fats, saturated_fats_status, ...rest }) => rest)
                                                    .sort((a, b) => b.sugar - a.sugar)
                                            }

                                            // Analyze for gout
                                            let results_dataset_gout
                                            if(exception_saturated_fats_status.length > 1){
                                                results_dataset_gout = filteredCalorieDaily.filter(item => 
                                                exception_saturated_fats_status.includes(item.saturated_fats))
                                                .map(({ sugar, sugar_status, carbohydrate, carbohydrate_status, dietary_fiber, dietary_fiber_status, sodium, sodium_status, ...rest }) => rest)
                                            } else {
                                                results_dataset_gout = filteredCalorieDaily
                                                    .map(({ sugar, sugar_status, carbohydrate, carbohydrate_status, dietary_fiber, dietary_fiber_status, sodium, sodium_status, ...rest }) => rest)
                                                    .sort((a, b) => b.saturated_fats - a.saturated_fats)
                                            }
                                            // Suggestion from Consume History
                                            const results_personal = rows.map((dt, index) => ({
                                                consume_name: dt.consume_name,
                                                calorie: dt.calorie
                                            })).filter(item => 
                                                !allergicContext.some(dt => item.consume_name.toLowerCase().includes(dt))
                                            )

                                            if (rows.length == 0 && results_dataset_blood_preasure.length == 0){
                                                code = 404
                                            }

                                            // Final Response
                                            res.status(code).json({ 
                                                message: generateQueryMsg(baseTable, rows.length), 
                                                status: code, 
                                                general_analyze_blood_preasure: results_dataset_blood_preasure,
                                                summary_analyze_blood_preasure: `Based on your blood preasure, we've got status ${systolic_status} for systolic and 
                                                    ${diastolic_status} for diastolic. ${param_sodium}`,
                                                general_analyze_blood_glucose: results_dataset_glucose,
                                                summary_analyze_blood_glucose: `Based on your glucose, we've got status ${glucose_status} for glucose. ${param_sugar}`,
                                                general_analyze_gout: results_dataset_gout,
                                                summary_analyze_gout: `Based on your gout, we've got status ${gout_status} for gout. ${param_saturated_fats}`,
                                                personal_analyze: results_personal,
                                                total_consumed_calorie: totalConsumedCalorie,
                                                summary_all_calorie: totalConsumedCalorie > 0 ? `Cause today you have consume ${totalConsumedCalorie} calorie. We only show you the food that have calorie below that`:`Today you still achieve 0 calorie so you free to choose what food you want to consume`
                                            })
                                        } 
                                    })
                                })
                            }
                        })
                    })
                    .on('error', (err) => {
                        res.status(500).send({
                            message: 'Internal server error',
                            status: 'failed'
                        });
                    });
                } else {
                    res.status(404).send({
                        message: 'User not found',
                        status: 'failed'
                    });
                }
            }
        })
    } catch (err) {
        res.status(500).send({
            message: 'Internal server error',
            status: 'failed'
        });
    }
}

module.exports = {
    getAnalyzeConsume,
    getAnalyzeConsumeMyBodyRelation
}