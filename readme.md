# GitHub Issues Blog CLI

将本地编写的 markdown 文件发布到指定的用作 blog 的 GitHub 的 issues。

## Use

```bash
> npm install -g git+ssh://git@github.com:ltinyho/test.git
```

or

```bash
> npm install -g molingyu/GHIBlog
```

## Quick Start

在你第一次运行`create` 或者 `publish` 时，会通过一个交互式的 CLI 创建用户配置文件。记录你的 GitHub 用户信息和用做 blog 的 repo.

### 创建博客

```bash
ghib --create MyBlog
```

附带 label

```bash
> ghib --create MyBlog --labels label1,label2
```

然后你会在当前目录下创建一个对应的 markdown 文件（`MyBlog.md`）。你可以用你的任意 markdown 编辑器打开并编辑它。

### 发布

```bash
> ghib --publish MyBlog --labels label1,label2
```

当然，你也可以使用它们的短命令格式，具体请参阅 `ghib -h`。
