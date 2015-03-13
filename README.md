#jquery-remoteLoad.js
 
This plugin lets you load remote HTML content into any DOM element using AJAX.

### Installing (bower)
```
bower install aegixx/jquery-remoteLoad.js --save
````

### Usage

#### remoteLoad
```html
<div id="testDiv" data-src="remote-page.html"></div>
````

```javascript
// Populate the selected elements from remote sources.
$('#testDiv').remoteLoad();
````

#### remoteSubmit
```html
<form id="testForm" method="post" action="remote-action.php" data-target="#testResults">
  <input name="name" placeholder="Your Name" type="text" />
  <input type="submit" value="Go!" />
</form>
<div id="testResults">
  Nothing here yet!
</div>
````

```javascript
$(document).ready(function () {
  // Prepare this form so it will remotely submit when triggered
  $('#testForm').remoteSubmit();
});
````

## License
Copyright (c) 2015 Bryan Stone
Dual licensed under the MIT and GPL licenses.