const fs = require('fs');
const util = require('util');
const express = require('express');
const asyncHandler = require('express-async-handler');

util.promisify(fs.stat);

const router = express.Router();

router.get('/stream/:hash', asyncHandler(async (req, res, next) => {
	
	// const file = res.locals.filePath;
	// vres to path apo ti vash

	const stat = await fs.stat(file);
	
	/* 
		Save the range the browser is asking for in a clear and reusable variable
		The range tells us what part of the file the browser wants in bytes.
		EXAMPLE: bytes=65534-33357823
	*/
	let range = req.headers.range;
	
	if (!range) {
		let err = new Error('Wrong range');
		err.status = 416;
		return next(err);
	}

	/*
		Convert the string range in to an array for easy use.
	*/
	let positions = range.replace(/bytes=/, '').split('-');

	/*
		Convert the start value in to an integer
	*/
	let start = parseInt(positions[0], 10);

	/*
	 	6.	Save the total file size in to a clear variable
	*/
	let file_size = stat.size;

	/*
		If the end parameter is present we convert it in to an integer, the same way we did the start position
		else we use the file_size variable as the last part to be sent.
	*/
	let end = positions[1] ? parseInt(positions[1], 10) : file_size - 1;

	/*
		8.	Calculate the amount of bits will be sent back to the
			browser.
	*/
	let chunksize = (end - start) + 1;


	/*
		Create the header for the video tag so it knows what is receiving.
	*/
	let head = {
		'Content-Range': 'bytes ' + start + '-' + end + '/' + file_size,
		'Accept-Ranges': 'bytes',
		'Content-Length': chunksize,
		'Content-Type': 'video/mp4'
	}

	/*
		Send the custom header
	*/
	res.writeHead(206, head);

	/*
		Create the createReadStream option object so createReadStream knows how much data it should be read from the file.
	*/
	let stream_position = {
		start: start,
		end: end
	}

	/*
		Create a stream chunk based on what the browser asked us for
	*/
	let stream = fs.createReadStream(file, stream_position)

	/*
		Once the stream is open, we pipe the data through the response object.
	*/
	stream.on('open', function () {
		stream.pipe(res);
	})

	/*
		If there was an error while opening a stream we stop the request and display it.
	*/
	stream.on('error', function (err) {
		return next(err);
	});


}));


module.exports = router;