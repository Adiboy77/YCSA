function scrapeCommentsWithoutReplies(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();//gets the entire spreadsheet as a whole 
  var result=[['Name','Comment','Time','Likes','Reply Count']];//the 5 columns
  var vid = ss.getSheets()[0].getRange(1,1).getValue();//0 because we've pasted the vidId in the first sheet, i.e. sheet1 of our spreadsheet, and 1,1 because it's in top-left cell
  var nextPageToken=undefined;//used for fetching the comments in chunks
  /*
  The API uses the maxResults parameter to indicate how many items should be included in an API response.
  If additional results are available for a query, then the API response will contain either a nextPageToken property, a prevPageToken property, or both. Those properties' values can then be used to set the pageToken parameter to retrieve an additional page of results.
  We do this for pagination: see More: https://www.seoptimer.com/blog/what-is-pagination/#What-use-pagination
  */
  while(1){
    var data = YouTube.CommentThreads.list('snippet', {videoId: vid, maxResults: 100, pageToken: nextPageToken})//maxResults is the chunks size
    nextPageToken=data.nextPageToken
    //console.log(nextPageToken);
    for (var row=0; row<data.items.length; row++) {
      result.push([data.items[row].snippet.topLevelComment.snippet.authorDisplayName,
                   data.items[row].snippet.topLevelComment.snippet.textDisplay,
                   data.items[row].snippet.topLevelComment.snippet.publishedAt,
                   data.items[row].snippet.topLevelComment.snippet.likeCount,
                   data.items[row].snippet.totalReplyCount]);
    }
    //Varying maxLength to see how comments are being appended in chunks:
    //console.log(result.length);
    //console.log(data.items.length);
    if(nextPageToken =="" || typeof nextPageToken === "undefined"){//If there are no comments in video or the video gets finished
      break;
    }
  }
var newSheet=ss.insertSheet(ss.getNumSheets())//new output sheet is just the next sheet 
newSheet.getRange(1, 1,result.length,5).setValues(result)//we fill the new output sheet from top-left(1,1) to number of rows = result.length, and 5 justifies columns

}
