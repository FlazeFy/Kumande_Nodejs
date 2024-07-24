const { analyzeImageProperties } = require("./props");

const analyzePhoto = async (url) => {
    const res_props = await analyzeImageProperties(url)
    const props_str = `- File Size: ${res_props['file_size']} bytes\n- Creation Date: ${res_props['creation_date']}\n- Modification Date: ${res_props['modification_date']}\n- File Type: ${res_props['file_type']}\n- Dimensions: ${res_props['dimensions']}`
    

    return `Color Analysis:\n${props_str}`
};

module.exports = { analyzePhoto }
