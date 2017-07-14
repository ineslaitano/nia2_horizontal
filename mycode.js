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

function generateFamilles(data) {
	var html = '';
	for(var row in data) {
		html += '<li>' + data[row][1] + '<ul id="famille' + data[row][0] + '"></ul></li>';
	}
	$('#menu').append(html);
}

function generateStructures(data) {
	for(var row in data) {
		// genere une couleur pastel aleatoire
		var couleur = randomPastel();
		var id_str = data[row][0];
		// asigne l'id_structure au id du checkbox et la couleur au name
		var html = '<li><input type="checkbox" id="' + id_str + '" name="' + couleur + '">';
		// ajoute une etiquette au checkbox
		html += '<label for="' + id_str + '">' + data[row][2] + '</label></li>\r\n';
		// ajoute la structure a sa famille
		$('#famille' + data[row][1]).append(html);
		// on change du checkbox
		$('#' + id_str).change(function() {
			$('label[for="' + this.id + '"]').css('background-color', this.name);
			generateNIA();
		});
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
					if( arrMedStr[j][0] == arrMedias[row][0] && arrMedStr[j][1] == $('input:checked')[i].id) {
						html += '<mark style="background-color:' + $('input:checked')[i].name + '" onclick="popup(this)">';
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

function randomPastel(){
    return '#' + (function co(lor){   return (lor += ['a','b','c','d','e','f'][Math.floor(Math.random()*6)])&& (lor.length == 6) ?  lor : co(lor); })('');
}

function popup(elem)
{
	var colHex = rgb2hex(elem.style.backgroundColor);
	if ($(colHex).length == 0) {
		//selectionne tous les mark qui ont la même couleur que le mark cliqué
		var parag = $('#nia mark[style="background-color:' + colHex + '"]');
		//cree un popup avec tout le texte
		var html = '<p id="' + colHex.substring(1) + '" class="popup">';
		for (var i = 0; i < parag.length; i++) {
			html += parag[i].innerHTML;
		}
		html += '</p>';
		$('body').append(html);
	}
}

function rgb2hex(rgb) {
    if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}