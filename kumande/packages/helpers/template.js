function templateSelectObjectColumn(mainCol, childCol, newName) {
    const res = `REPLACE(JSON_EXTRACT(${mainCol}, '$[0].${childCol}'), '\"', '') AS ${newName}`

    return res
}

module.exports = {
    templateSelectObjectColumn
}