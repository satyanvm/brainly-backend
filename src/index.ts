import express from "express";
import { Request, Response } from "express";
import { random } from "./utils";
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, TwitterContentModel, UserModel } from "./db";
import { JWT_PASSWORD } from "./config";
import { userMiddleware } from "./middleware";
import cors from "cors";
import mongoose from "mongoose";
import { redirect, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/v1/signup", async (req, res) => { 
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;

  console.log(username);
  console.log(password);
  console.log("hi");

  try {
    const newuser = await UserModel.create({
      username: username,
      password: password,
    });
    console.log(newuser);
    console.log("above is the log from the try block");

    res.status(201).json({
      message: "User signed up",
      newuser,
    });
    return;
  } catch (e) {
    res.status(500).json({
      message: "Caught in the try block",
    });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const existingUser = await UserModel.findOne({
    username: username,
    password: password,
  });
  const userId = existingUser?.id;
  if (existingUser) {
    const token = jwt.sign(
      {
        id: existingUser._id,
      },
      JWT_PASSWORD
    );

    res.json({
      token,
      userId,
    });
  } else {
    res.status(403).json({
      message: "Incorrrect credentials",
    });
  }
});

app.post("/api/v1/signout", userMiddleware, async (req, res) => {
  const signout = req.body.signout;

  if (signout) {
    redirect("/api/v1/signin");
    res.json({
      message: "Successfully done!",
    });
  }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const link = req.body.link;
  const type = req.body.type;
  const title = req.body.title;

  try {
    if (!link) {
      res.status(500).json({
        message: "problem",
      });
      return;
    }
    if (type == "youtube") {
      await ContentModel.create({
        link,
        title,
        type: type,
        userId: req.userId,
      });
    } else {
      await ContentModel.create({
        link,
        type,
        title,
        userId: req.userId,
      });
    }

    res.json({
      message: "Content added",
    });
  } catch (e) {
    console.log(e);
  }
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
  const content = await ContentModel.find({});

  res.json({
    content,
  });

  // here instead of selectively selecting specific items in the contents model and then printing, i will first print all the
  // elements in the database
});

app.post("/api/v1/contentdelete", userMiddleware, async (req, res) => {
  try {
    const id = req.body.id;     
    if (!id) {      
      throw new Error("id is not available in the body");
    }  
    // logic to find the id through the link  

    await ContentModel.deleteOne({ _id: id});
    const contents = await ContentModel.findOne({});
    res.json({                                   
      contents,
    });  
  } catch (e) {
    console.log(e);
    res.json({
      message: "some issue in the post delete request",
    });
  }
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
  const share = req.body.share;
  if (share) {
    if (!req.userId) {
      console.log("Please provide userid in the request body");
      res.json({
        message: "Please provide userid in the req body",
      });
      return;
    }
    const existingLink = await LinkModel.findOne({
      userId: req.userId,
    });

    if (existingLink) {
      res.json({
        hash: existingLink.hash,
      });
      return;
    }
    const hash = random(10);
    await LinkModel.create({
      userId: req.userId,
      hash: hash,
    });

    res.json({
      hash,
    });
  } else {
    const hash = random(10);
    await LinkModel.create({
      userId: req.userId,
      hash: hash,
    });

    res.json({
      message: "we have added this new hash to the linkmodel",
    });
  }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const hash = req.params.shareLink;

  const link = await LinkModel.findOne({
    hash,
  });

  if (!link) {
    res.status(411).json({
      message: "Sorry incorrect input",
    });
    return;
  }
  // userId
  const content = await ContentModel.find({
    userId: link.userId,
  });

  console.log(link);
  const user = await UserModel.findOne({
    _id: link.userId,
  });

  if (!user) {
    res.status(411).json({
      message: "user not found, error should ideally not happen",
    });
    return;
  }

  res.json({
    userid: user.id,
    content: content,
  });
});

app.get("/api/v1/findcontent", async (req, res) => {
  try {
    console.log(req.query);
    const { link } = req.query;
    console.log(link);
    ContentModel.findOne({
      link: link,
    }).then((response) => {
      const id = response?._id;
      res.json({
        response,
      });
    });
  } catch (e) {
    console.log(e);
  }
});

app.listen(3000);
