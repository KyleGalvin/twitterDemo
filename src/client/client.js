define(function(require){


	var offset = 0;
	var limit = 10;
	var totalRecords = 0;
	var dataTable = null//we use this to clear the table between pagination update
	var loadTable = function(){
		var lastViewedRecord = offset+limit;
		if(lastViewedRecord > totalRecords){
			lastViewedRecord = totalRecords;
		}

		$('.status').text("Viewing "+offset+" to "+ lastViewedRecord + " of "+ totalRecords)
		if(dataTable){
			console.log("data table: ", dataTable)
			dataTable.ajax.url('/tweets?limit='+limit+'&offset='+offset).load()
			//dataTable.ajax.reload()//fnReloadAjax('/tweets?limit='+limit+'&offset='+offset)//if we are paginating, clear old data table
		}else{
			dataTable = $(".twitterDataTable").DataTable({
				sDom:'',//disable search box
				paging:false,
				autoWidth:false,//allows us to take control of resizing during a window.resize event
				ajax: {
					url:'/tweets?limit='+limit+'&offset='+offset,
					dataSrc:''
				},
				columns: [
					{'width':'55%',title:'Text:',data:'text',"defaultContent":""},
					{'width':'15%',title:'Username:',data:'user.name',"defaultContent":""},
					{'width':'15%',title:'Date:',data:'created_at',"defaultContent":""},
					{'width':'15%',title:'Location:',data:'place.name',"defaultContent":""},
				]
			});

		}


	}
	var countRecords = function(){
		$.ajax({
			url:"./tweetCount",
			success: function(result){
				totalRecords = result.count;
				loadTable()
			}
		})
	}
	$(window).resize(function(event){
		console.log('window resize event')
		dataTable.columns.adjust().draw()
	})
	$(document).ready(function(){
		$(".next").click(function(){
			offset = offset + limit
			countRecords()
		})
		$(".prev").click(function(){
			offset = offset - limit
			if(offset < 0){
				offset = 0
			}
			countRecords()
		})
		countRecords()
	})
})
