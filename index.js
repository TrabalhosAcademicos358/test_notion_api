const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const { Client } = require("@notionhq/client");
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

const create = async (name, description) => {
    const id = uuidv4();
    const response = await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
            id: {
                type: "title",
                title: [
                    {
                        type: "text",
                        text: {
                            content: id,
                        },
                    },
                ],
            },
            name: {
                type: "rich_text",
                rich_text: [
                    {
                        type: "text",
                        text: {
                            content: name,
                        },
                    },
                ],
            },
            description: {
                type: "rich_text",
                rich_text: [
                    {
                        type: "text",
                        text: {
                            content: description,
                        },
                    },
                ],
            },
        },
    });
    return response;
};

const query = async (name) => {
    const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
            property: "name",
            rich_text: {
                contains: name,
            },
        },
    });
    return response.results.at(-1);
};

const queryAll = async () => {
    const response = await notion.databases.query({
        database_id: databaseId,
    });
    return response.results;
};

const update = async (pageId) => {
    const response = await notion.pages.update({
        page_id: pageId,
        properties: {
            description: {
                type: "rich_text",
                rich_text: [
                    {
                        type: "text",
                        text: {
                            content: "E nesse vídeo",
                        },
                    },
                ],
            },
        },
    });
    return response;
};

const del = async(id) => {
    await notion.blocks.delete({
        block_id: id
    })
}

const main = async () => {
    const name = "Pedrinho Gameplays";
    const description = "Oi galerinha, bora para mais um vídeo no canal";
    try {
        await create(name, description);
        const responseQuery = await query(name);
        const updateRes = await update(responseQuery.id);
        console.log(updateRes);
    } catch (error) {
        console.error(error);
    }
};

const clean = async () => {
    const list = await queryAll()
    for (const item of list) {
        del(item.id)
    }
}

// main();
clean()
