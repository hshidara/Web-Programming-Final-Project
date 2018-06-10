// globals
var keyWordStr = "";


// called when the Submit button is pushed 
function gotKeyword() {

    // get what the user put into the textbox
    keyWordStr = document.getElementById("keywordBox").value;

    // send an AJAX request
    var oReq = new XMLHttpRequest();
    var url = "query?tags="+keyWordStr;;
    oReq.open("GET", url);
    oReq.addEventListener("load", gotJSONNowWhat);
    oReq.send();

    // callback function
    // picks up oReq in closure
    function gotJSONNowWhat() {
	var resp = JSON.parse(oReq.responseText);
	showPhotos(JSON.parse(resp.body));

    // Point A

    }
}
    

// displays a new group of photos
function showPhotos(photoDesc) {

    // get photo src urls out of response JSON and into an array
    // decodes Flickr photo server syntax
    var descriptions = photoDesc.photos.photo;
    var photos = [];
    for (var i=0; i<6; i++) {
	var d = descriptions[i];
	var imgURL = "https://farm"+d.farm+
		".staticflickr.com/"+d.server+
		"/"+d.id+"_"+d.secret+"_m.jpg";
	photos.push(imgURL);
    }

    // use React to display photos
    var reactDiv = document.getElementById("react");
    reactDiv.innerHTML = ""; // get rid of old ImageStack
    ReactDOM.render(React.createElement(ImageStack, {urlList: photos}),
		    reactDiv);

    // Point B

}


// A react component for an image tile
class Tile extends React.Component {

    render() {
	var src = this.props.photo.src;
	var index = this.props.index;
	var parentFunction = this.props.parentFunction;
	var dispClass = "notSelected";
	if (this.props.photo.selected) { dispClass = "selected" };
	
	// Point C

	// each image gets an onclick function that tells parent
	// ImageStace index of photo to toggle
	return (
	    React.createElement('img',
		{className: dispClass,
		 src: src,
		 onClick: function(e) { parentFunction(e,index); }}
			       ) // createElement
	) // return
    } // render
} // class


// A react component for a collection of images
class ImageStack extends React.Component {

    constructor(props) {
	super(props);
	var photoObjs = [];
	for (let i=0; i< this.props.urlList.length; i++) {
	    var newObj = {src: this.props.urlList[i], selected: false};
	    photoObjs.push(newObj);
	}
	this.state = { photos: photoObjs };
	this.select = this.select.bind(this);
    }

    select(e, photoIndex) {
	var photoObjs = this.state.photos;
	if (!photoObjs[photoIndex].selected) {
	    photoObjs[photoIndex].selected = true;
	}
	this.setState({photos: photoObjs});

	// Point D
	
    }

    replyFromServer() {
	console.log("database operation AJAX response");
    }

    render() {
	var elementArray = [];

	// Point E
	
	for (let i=0; i<this.state.photos.length; i++) {
	    elementArray.push(
		React.createElement(Tile,
				    {photo: this.state.photos[i],
				     index: i,
				     key: i,
				     parentFunction: this.select})
	    ) // push
	} // for
	
	return (React.createElement('div', 
	        { className: 'ImageStack'},
		 // contents of the div - the photo tiles
		elementArray
		)//createElement div
	); // return
    } // render
} // class


function addPhotoAJAX ( /* args? */ ) {

    // need code here

}
