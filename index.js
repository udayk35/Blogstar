import bodyParser from "body-parser";
import express from "express";
import fs from "node:fs";
import {dirname} from "path";
import { fileURLToPath } from "url";
const __dirname=dirname(fileURLToPath(import.meta.url));

const fileSystem= fs;
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({extended : true}));
app.get("/", (req, res) => {

    res.render("index.ejs");
});

app.get("/post", (req, res) => {
    
    res.render("createblog.ejs");
});

app.get("/blogs", async (req, res) => {

    const src=__dirname+"/blogs";
    try {
        const data = await fileSystem.promises.readdir(src);
        const fileObj = {};

        await Promise.all(data.map(async (file) => {
            const fileContent = await fileSystem.promises.readFile(src + "/" + file, "utf8");
            fileObj[file] = fileContent;
        }));


        // Send the fileObj as a response or render it in your view
        const fileNames = Object.keys(fileObj);
        res.render("blogs.ejs", { fileObj, fileNames });
    } catch (err) {
        console.error("Error reading files:", err);
       
    }
});

app.get("/contact", (req, res) => {
    
    res.render("contact.ejs");
});
app.post("/submit", (req, res) => {
    const src=__dirname+"/blogs/"+req.body["title"];
    fileSystem.writeFile(src, req.body["content"], (err)=>
    {
            if (err) throw err
            res.render("blogcreated.ejs");
    });

});

app.post("/contact/submit", (req, res) => {
    const src=__dirname+"/queries/"+req.body["name"];
    fileSystem.writeFile(src, req.body["content"], (err)=>
    {
            if (err) throw err
            res.render("querysubmit.ejs", {name : req.body["name"]});
    });

});
app.listen(port, () => {
    console.log(`Server is Listening ${port}`);
})