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

const main = async () => {
    try {
        const response = await create(
            "Pedrinho Gameplays",
            "Oi galerinha, bora para mais um vídeo no canal"
        );
        console.log(response);
    } catch (error) {
        console.error(error);
    }
};

main();
