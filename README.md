# Img2iss

## Description

This app batch creates issues for GitHub, using a directory containing images as
a start point. Each image is turned into a separate issue, using the filename as
a title.

## Usage

```
$ img2iss <user/repo> [options]
```

### Options

```
-d, --directory <directory>  : Specifies a target directory. Defaults to the current directory
-g, --github-token <token>   : Set the GitHub token to be used
-u, --github-user <username> : Set your GitHub username
-i, --imgur-id <id>          : Set the Imgur ID to be used
-s, --save                   : Save GitHub and Imgur options as defaults and exit
```
