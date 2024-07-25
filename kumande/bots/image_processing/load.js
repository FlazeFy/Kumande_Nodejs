const { add_firestore } = require("../modules/analyze");
const { analyzeColor } = require("./color");
const { analyzeImageProperties } = require("./props");

const analyzePhoto = async (url,id) => {
    const res_props = await analyzeImageProperties(url)
    const props_str = `- File Size: ${res_props['file_size']} bytes\n- Creation Date: ${res_props['creation_date']}\n- Modification Date: ${res_props['modification_date']}\n- File Type: ${res_props['file_type']}\n- Dimensions: ${res_props['dimensions']}`
    const res_color = await analyzeColor(url)

    let data = {
        telegram_id: id,
        color_analyze: res_color,
        props_analyze: res_props
    };
    const fire_id = await add_firestore(data, 'analyze')

    return `<b>Color Analysis :</b>\n${res_color}\n\n<b>Image Properties :</b>\n${props_str}]\n\n<b>Analyze ID :</b>${fire_id}`
};

module.exports = { analyzePhoto }
