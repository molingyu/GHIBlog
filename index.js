#!/usr/bin/env node

const GitHub = require('github-api')
const fs = require('fs')
const os = require('os')
const path = require('path')
const commander = require('commander')
const inquirer = require('inquirer')

const confPath = path.join(os.homedir(), 'ghib.json')

const issue = {
  title: '',
  body: '',
  labels: []
}

const blogTemplate = `
---
title: $TITLE$
labels: $LABELS$
---
# $TITLE$
`

function createConf () {
  if (fs.existsSync(confPath)) {
    return
  }
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'username',
        message: 'GitHub username:'
      },
      {
        type: 'password',
        name: 'password',
        message: 'GitHub password:'
      },
      {
        type: 'input',
        name: 'blogRepo',
        message: 'Blog repository: (blog)',
        default: function () {
          return 'blog'
        }
      }
    ])
    .then(answers => {
      let conf = require('./userConf.json')
      conf.username = answers.answers
      conf.password = answers.password
      conf.blogRepo = answers.blogRepo
      fs.writeFileSync(confPath, JSON.stringify(conf), null, 4)
    })
}

function issueCallback (error, result, request) {
  if (error) {
    console.log(`publish error!\n${error}`)
  }
}

function create (fileName, labels) {
  createConf()
  let blog = blogTemplate
    .replace(/\$TITLE\$/g, fileName)
    .replace(/\$LABELS\$/g, labels || '')
  fs.writeFileSync(path.join(process.cwd(), fileName + '.md'), blog)
}

function publish (filePath) {
  createConf()
  let conf = require(confPath)
  let gh = new GitHub({
    username: conf.username,
    password: conf.password
  })
  let blog = gh.getIssues(conf.username, conf.blogRepo)
  console.log(path.join(process.cwd(), filePath))
  let blogBody = fs.readFileSync(path.join(process.cwd(), filePath), { encoding: 'utf-8' })
    .replace(/^---\ntitle:([^\n]*)\nlabels:([^\n]*)\n---\n/m, '')
  issue.title = RegExp.$1
  RegExp.$2 !== '' ? issue.labels = RegExp.$2.split(',').map(str => str.trim()) : delete issue.labels
  issue.body = blogBody
  blog.createIssue(issue, issueCallback)
}

commander
  .version('0.0.1')
  .option('-c, --create <name>', 'create a blog for github issues')
  .option('-l, --labels <labels>', 'blog labels')
  .option('-p, --publish <path>', 'publish blog to github issues')

commander.parse(process.argv)

if (commander.create) create(commander.create, commander.labels)
if (commander.publish) publish(commander.publish)
