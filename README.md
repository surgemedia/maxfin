
This building was created to help up make wireframe for clients quickly and easily. It also allows us to reuse the code we write here in whatever CMS system we want to use for the project.

##Setup in terminal 
- `sudo npm install` *can take a few mins* 
- `sudo bower install` 
- `gulp` - upload the `render/` is your file site

##Assets 
- found under `cwd/assets/*` 
- converted assets go to `render/assets/*`

##Frameworks
- [Bower](http://bower.io/)
- [gulpjs](http://gulpjs.com/) 
-  [Sass](http://sass-lang.com/) 
- [Npm](https://www.npmjs.com/) 
- [Nodejs](https://nodejs.org/)
- [Bootstap](http://getbootstrap.com/)

###Includes 
found under `cwd/includes` set as base for includes. Here are some example include codes
includes allow variables like so this would be `card.html`. We are currently building a library of predefined includes if you would like to add some!


Code in the page
```html
<include src="containers/card.html" title="a great title" img="http://https://unsplash.it/200/300/?random" > this content is put into the predefined value 'content' 
</div>
```
This is an example of the	`card.html`
```html 
<div class="card">
<img src="@@img" />
<h1>@@title</h1>
<p>@@content</p>
</div>

``` 
this would render

```html 
<div class="card">
<img src="http://https://unsplash.it/200/300/?random" />
<h1>a great title</h1>
<p>this content is put into the predefined value 'content' </p>
</div>

```

##Sass
bootstrap sass files and your sass files are concatenated from the imports listed
`cwd/assets/sass/all.scss.`

```
- SASS
|___  _global.scss
|___  _vars.scss
|___  _footer.scss
|___  all.scss
```
Example of all.scss
```css
@import "vars";  
@import "global";
@import "footer";
```

Concatenates to 
- `render/skin.css`

##Js 
In `bower.json` setup any js you want included in your project and they will be concatenated along with main.js in the asset folder.
- `cwd/assets/js/main.js`

After concat
- `render/assets/js/main.js`

##Gulp Commands 
`gulp` does a fresh build of the render folder
`gulp watch` does a less then fresh render of the folder but wathes all the files.
`gulp clear`  clears any gulp cache
`gulp clean` deletes render