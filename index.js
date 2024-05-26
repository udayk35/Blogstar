import bodyParser from "body-parser";
import express from "express";
import fs from "node:fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const fileSystem = fs;
const app = express();
const port = 3000;
var fileName = "";



app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {

    res.render("index.ejs");
});

app.get("/post", (req, res) => {

    res.render("createblog.ejs");
});

app.get("/blogs", async (req, res) => {

    const src = __dirname + "/blogs";
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

app.get("/delete", (req, res) => {
    res.render("deleteblog.ejs");
});

app.post("/delete", (req, res) => {
    const src = __dirname + "/blogs/" + req.body["title"];
    fileName = req.body["title"];

    fileSystem.readFile(src, (err, data) => {
        if (err) throw err
        res.render("showblog.ejs", { fileName, data, delete: true })
    });
})
app.post("/deleteblog", (req, res) => {
    const src = __dirname + "/blogs/" + req.body["title"];
    fileName = req.body["title"];
    fileSystem.rm(src, { force: true }, (err) => {
        if (err) throw err
        res.render("Status.ejs", { delete: true, fileName });
    });
})
app.post("/submit", (req, res) => {
    const src = __dirname + "/blogs/" + req.body["title"];
    fileName = req.body["title"];
    fileSystem.writeFile(src, req.body["content"], (err) => {
        if (err) throw err
        res.render("status.ejs", { update: false, fileName });
    });

});


app.get("/update", (req, res) => {
    res.render("showblog.ejs", { update: true });
});

app.get("/show", (req, res) => {
    res.render("showblogcontent.ejs");
})
app.post("/showblog", (req, res) => {
    const src = __dirname + "/blogs/" + req.body["title"];
    fileName = req.body["title"];

    fileSystem.readFile(src, (err, data) => {
        if (err) throw err
        res.render("showblog.ejs", { fileName, data })
    })
});
app.post("/blogupdate", (req, res) => {
    const src = __dirname + "/blogs/" + req.body["title"];
    fileName = req.body["title"];

    fileSystem.readFile(src, (err, data) => {
        console.log("" + data);
        if (err) throw err
        res.render("showblog.ejs", { fileName, data, update: true });
    });
});
app.post("/blogcontentupdate", (req, res) => {

    const src = __dirname + "/blogs/" + req.body["title"];
    fileSystem.writeFile(src, req.body["content"], { flag: 'a+' }, (err) => {
        if (err) throw err
        console.log(`Blog updated with title ${req.body["title"]}`);
        res.render("status.ejs",
            {
                update: true,
                fileName,
            });
    });
});

app.post("/contact/submit", (req, res) => {
    const src = __dirname + "/queries/" + req.body["name"];
    fileSystem.writeFile(src, req.body["content"], (err) => {
        if (err) throw err
        res.render("querysubmit.ejs", { name: req.body["name"] });
    });

});
app.listen(port, () => {
    console.log(`Server is Listening ${port}`);
})