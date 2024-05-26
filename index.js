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


app.use(express.static("styles"));

app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    const src = __dirname + "/welcome.txt";
    fileSystem.readFile(src, (err, data) => {

        res.render("index.ejs",{
            data
        });
    })

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
try{

    fileSystem.readFile(src, (err, data) => {
        if (err) {
            const errorMessage = "No Blog found with Title '" + fileName + "'";
            res.render("status.ejs", { data: errorMessage });
        } else {
            res.render("showblog.ejs", { fileName, data, delete: true });
        }
    });
    }
    catch(error)
    {
        console.error("Error reading file:", error);
    }
})
app.post("/deleteblog", (req, res) => {
    const src = __dirname + "/blogs/" + req.body["title"];
    fileName = req.body["title"];
    fileSystem.rm(src, { force: true }, (err) => {
        if (err) throw err
        const data = "Blog Deleted Title: "+fileName;
        res.render("Status.ejs", { data });
    });
})
app.post("/submit", (req, res) => {
    const src = __dirname + "/blogs/" + req.body["title"];
    fileName = req.body["title"];
    fileSystem.writeFile(src, req.body["content"], (err) => {
        if (err) throw err
        const data = "Blog created with Title "+fileName;
        res.render("status.ejs", { data });
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
const fileName = req.body["title"];

try {
    fileSystem.readFile(src, (err, data) => {
        if (err) {
            const errorMessage = "No Blog found with Title '" + fileName + "'";
            res.render("status.ejs", { data: errorMessage });
        } else {
            res.render("showblog.ejs", { fileName, data });
        }
    });
} catch (error) {
    // Handle any synchronous errors (if any)
    console.error("Error reading file:", error);
    // You can send an error response here if needed
}
     });
app.post("/blogupdate", (req, res) => {
    const src = __dirname + "/blogs/" + req.body["title"];
    fileName = req.body["title"];

    fileSystem.readFile(src, (err, data) => {
        if (err) throw err
        res.render("showblog.ejs", { fileName, data, update: true });
    });
});
app.post("/blogcontentupdate", (req, res) => {

    const src = __dirname + "/blogs/" + req.body["title"];
    fileSystem.writeFile(src, req.body["content"], { flag: 'a+' }, (err) => {
        if (err) throw err
        const data = "Blog updated with Title "+req.body["title"];
        res.render("status.ejs",
            {
                data
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