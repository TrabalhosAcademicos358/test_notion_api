const dotenv = require("dotenv");
const { Client } = require("@notionhq/client");
dotenv.config();

const axios = require("axios");

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

function formatUUID(uuidStr) {
    return uuidStr.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
}

function getValues(properties) {
    const response = {};
    for (const key in properties) {
        const obj = properties[key];

        const { type } = obj;
        const value = obj[type][0].plain_text;

        response[key] = value;
    }
    return response;
}

const main = async () => {
    const response = await notion.databases.query({
        database_id: databaseId,
    });
    const id = response.results[0];
    const obj = getValues(response.results[0].properties);
    const pageId = formatUUID(obj.id_page);
    // const newResponse = await getPageContent({ pageId })
    
    const resPageReq = await notion.pages.retrieve({
        page_id: pageId
    })
    const title = resPageReq.properties.title.title[0].plain_text

    const newResponse = await notion.blocks.children.list({
        block_id: pageId,
        page_size: 50,
    });
    // console.log(newResponse.results);
    console.log(newResponse.results[1].paragraph.rich_text)
};

main();
