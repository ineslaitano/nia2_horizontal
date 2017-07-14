var arrMedias=[];
var arrMedStr=[];

$(document).ready(function() {
	// options = {
	// delimiter: config.delimiter,
	// separator: config.separator,
	// onPreParse: options.onPreParse,
	// onParseEntry: options.onParseEntry,
	// onParseValue: options.onParseValue,
	// onPostParse: options.onPostParse,
	// start: options.start,
	// end: options.end,
	// state: {
	  // rowNum: 1,
	  // colNum: 1
		// }
	// };
	
	$.ajax({
	url: "nia_structures_famille_utf8.csv",
	dataType: "text",
	success: function(input) {
		var options = {
			start: 2 //ne prend pas en compte les entetes
			};
		var data = $.csv.toArrays(input, options);
		generateFamilles(data);
		}
	});
	
	$.ajax({
	url: "nia_structures_structure_utf8.csv",
	dataType: "text",
	success: function(input) {
		var options = {
			separator:';',
			start: 2 //ne prend pas en compte les entetes
			};
		var data = $.csv.toArrays(input, options);
		generateStructures(data);
		}
	});
	
	$.ajax({
	url: "chant1_media_utf8.prn",
	dataType: "text",
	success: function(input) {
		var options = {
			separator:' ',
			start: 2 //ne prend pas en compte les entetes
			};
		arrMedias = $.csv.toArrays(input, options);
		}
	});
	
	$.ajax({
	url: "chant1_media_ds_structure_utf8.prn",
	dataType: "text",
	success: function(input) {
		var options = {
			separator:' ',
			start: 2 //ne prend pas en compte les entetes
			};
		arrMedStr = $.csv.toArrays(input, options);
		generateNIA();
		}
	});
});

$(document).change(function() {
    generateNIA();
});
 
function generateFamilles(data) {
	var html = '';
	for(var row in data) {
		html += '<li>' + data[row][1] + '<ul id="famille' + data[row][0] + '"></ul></li>';
	}
	$('#menu').append(html);
}

function generateStructures(data) {
	for(var row in data) {
		$('#famille' + data[row][1]).append( '<li class="couleur' + data[row][0] + '"><input type="checkbox" value="' + data[row][0] + '">' + data[row][2] + '</li>\r\n');
		// //si el id_parent está vacío, se agrega a su familia. 
		// if(data[row][3] =='') {
			// $('#famille' + data[row][1]).append( '<li>' + data[row][2] + '</li>\r\n<ul id="structure' + data[row][0] + '"></ul>');
		// }
		// else //sino se agrega al id_parent
		// {
			// $('#structure' + data[row][3]).append( '<li>' + data[row][2] + '</li>\r\n<ul id="structure' + data[row][0] + '"></ul>');
		// }
	}
}

function generateNIA() {
	$('#nia').empty();
	var html = '';
	var ligne = 0;
	for(var row in arrMedias) {
		var balisesFermantes = '';
		//le media est il dans une structure ?
		if ($('input:checked').length > 0){
			for (var i = 0; i < $('input:checked').length; i++) {
				//recherche dans media_ds_structure
				for( var j = 0; j < arrMedStr.length; j++ ) {
					if( arrMedStr[j][0] == arrMedias[row][0] && arrMedStr[j][1] == $('input:checked')[i].value) {
						html += '<mark class="couleur' + arrMedStr[j][1] + '">';
						balisesFermantes += '</mark>';
						if (arrMedStr[j][2] == 'true'){
							html += '<strong>';
							balisesFermantes += '</strong>';
						}
						break;
					}
				}
			}
		}
		
		if(arrMedias[row][4] < 1000) {
			if(arrMedias[row][3] == ligne) {
				html += arrMedias[row][1] + ' ';
			}
			else
			{
				html += '<br/>' + arrMedias[row][1] + ' ';
				ligne = arrMedias[row][3];
			}
		}	
		else
		{
			//traitement des images
		}
		
		html += balisesFermantes;
	}
	$('#nia').append(html);
}