# Img2iss

## Description

This Node app batch creates issues for GitHub, using a directory containing images as a start point. Each image is turned into a separate issue, using the filename as a title.

As GitHub doesn't currently let you upload images directly, they are uploaded to Imgur as private images, and URLs used to create the issues.

## Requirements

* Node
* A GitHub OAuth token
* An Imgur client ID

## Installation

```
npm install -g img2iss
```

## Setup

If you're running img2iss for the first time, it will ask you for your Imgur and GitHub account details in order to generate its access tokens. These details won't be saved.

## Usage

```
$ img2iss [user|org/]<repo> [directory] [options]
```

## Examples

Create issues from all the screenshots in the current working directory for the `rogerhutchings/testrepo` repo:

```
img2iss rogerhutchings/testrepo
```

Create issues from all the screenshots in the `images` directory for the `rogerhutchings/othertestrepo` repo:

```
img2iss rogerhutchings/othertestrepo images
```

## License

Copyright (C) 2014 Roger Hutchings

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
