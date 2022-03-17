//let podcastDB = 'https://jsonblob.com/api/jsonBlob/953773366167486464';

let cardContainer;

function getCurrentPage()
{
    var path = window.location.pathname;
    var page = path.split("/").pop();
    console.log( page );
    return page;
}

function createPodCastCard(Info) 
{

    let card = document.createElement('div');
    card.className = 'card shadow cursor-pointer';

    let cardBody = document.createElement('div');
    cardBody.className = 'card-body bg-dark text-white';

    let title = document.createElement('h5');
    title.innerText = Info.Title;

    let name = document.createElement('h7');
    name.innerText = Info.Name;

    let journal = document.createElement('p');
    journal.innerText = Info.Journal;

    let date = document.createElement('h7');
    date.innerText = Info.Year;

    let doi = document.createElement('p');
    doi.innerText = "DOI: " + Info.DOI;

    let audio = document.createElement('audio');
    audio.controls = 'controls';

    let source = document.createElement('source');
    source.src = Info.File;
    source.type = "audio/mp3";

    let save = document.createElement('button');
    save.innerText = "Save";
    save.className = "btn btn-sm btn-primary btn-block";
    save.id = "savebutton";
    save.onclick = function() { Save(parseInt(Info.DOI)); }

    let unsave = document.createElement('button');
    unsave.innerText = "Remove Save";
    unsave.className = "btn btn-sm btn-secondary btn-block";
    unsave.id = "savebutton";
    unsave.onclick = function() { UnSave(parseInt(Info.DOI)); }

    let e = document.createElement('p');

    let star1 = document.createElement('button');
    if (Info.Rating > 0)
        star1.innerText = "★";
    else
        star1.innerText = "☆";
    star1.className = "btn btn-sm btn-dark btn-block";
    star1.onclick = function() { Rate(Info.DOI, 1); }

    let star2 = document.createElement('button');
    if (Info.Rating > 1)
        star2.innerText = "★";
    else
        star2.innerText = "☆";
    star2.className = "btn btn-sm btn-dark btn-block";
    star2.onclick = function() { Rate(Info.DOI, 2); }

    let star3 = document.createElement('button');
    if (Info.Rating > 2)
        star3.innerText = "★";
    else
        star3.innerText = "☆";
    star3.className = "btn btn-sm btn-dark btn-block";
    star3.onclick = function() { Rate(Info.DOI, 3); }

    let star4 = document.createElement('button');
    if (Info.Rating > 3)
        star4.innerText = "★";
    else
        star4.innerText = "☆";
    star4.className = "btn btn-sm btn-dark btn-block";
    star4.onclick = function() { Rate(Info.DOI, 4); }

    let star5 = document.createElement('button');
    if (Info.Rating > 4)
        star5.innerText = "★";
    else
        star5.innerText = "☆";
    star5.className = "btn btn-sm btn-dark btn-block";
    star5.onclick = function() { Rate(Info.DOI, 5); }

    cardBody.appendChild(title);
    cardBody.appendChild(name);
    cardBody.appendChild(journal);
    cardBody.appendChild(date);
    cardBody.appendChild(doi);

    if (CheckIsLoggedIn())
    {
        cardBody.appendChild(star1);
        cardBody.appendChild(star2);
        cardBody.appendChild(star3);
        cardBody.appendChild(star4);
        cardBody.appendChild(star5);
    }

    cardBody.appendChild(e);
    cardBody.appendChild(audio);
    audio.appendChild(source);

    if (CheckIsLoggedIn() && !checkSaved(Info.DOI))
    {
        cardBody.appendChild(save);
    }
    else if (checkSaved(Info.DOI))
    {
        cardBody.appendChild(unsave);
    }


    card.appendChild(cardBody);
    cardContainer.appendChild(card);

}

function setSortType(type)
{
    localStorage.setItem('SortType', type);
    location.reload();
}

function getSortType()
{
    return localStorage.getItem('SortType');
}

function setPage(page)
{
    localStorage.setItem('Page', page);
    location.reload();
}

function getPage()
{
    return localStorage.getItem('Page');
}

function setSearch(search)
{
    localStorage.setItem('Search', search);
    window.location.href = "search.html";
    console.log(localStorage.getItem('Search'));
}

function setGSearch(search)
{
    localStorage.setItem('Search', search);
}

function getSearch()
{
    return localStorage.getItem('Search');
}

function setPodcastAmount(amt)
{
    localStorage.setItem('PodcastAmount', amt);
}

function getPodcastAmount()
{
    return localStorage.getItem('PodcastAmount');
}

function GotoPage(goto) // Page Buttons
{
    if (getPodcastAmount > 15 && goto == 1) // Forward
        setPage(getPage + 1);
    if (getPodcastAmount > 15 && goto == 0) // Back
        setPage(getPage - 1);
}

function CalcRating(rating)
{
    const avg = (array) => array.reduce((a, b) => a + b) / array.length;
    return avg(rating);
}

let initListOfPodCasts = () => 
{
    if (cardContainer) 
    {
        document.getElementById('PodCast-card').replaceWith(cardContainer);
        return;
    }

    $.getJSON(podcastDB, function(data)
    {
        cardContainer = document.getElementById('PodCast-card');

        let Page = getPage();

        if (Page === null)
        {
            setPage(1);
        }

        // Should you custom search
        let Search = getSearch();
        let customSearch = false;

        if (Search === null || Search == "")
            customSearch = false;
        else
            customSearch = true;
        
        // Sort //
        var current = new Date();
        var dd = String( current.getDate()).padStart(2, '0');
        var mm = String( current.getMonth() + 1).padStart(2, '0');
        var yyyy =  current.getFullYear();
        let curDate = new Date(yyyy, mm, dd);
        console.log(curDate);

        let sortType = getSortType();

        if (sortType === null)
        {
            setSortType('newest');
        }

        let sort = [];
        for (let i = 0; i < data.length; i++)
        {
            if ((sortType != "newest" && sortType != "oldest") && data[i]['year'] != sortType)
                continue;

            sort[i] = 
            {
                "Date" : new Date(data[i]['year'], data[i]['month'], data[i]['day']),
                "Index" : i,
            };
        }
        console.log(sort);

        if (sortType === "newest")
            sort.sort((date1, date2) => date2.Date - date1.Date);
        else if (sortType === "oldest")
            sort.sort((date1, date2) => date1.Date - date2.Date);

        console.log(sort);
        // Done Sorting //

        console.log(data);
        setPodcastAmount(data.length); // Set podcast amount so we can tell if there is more then 1 page
        for (let i = 0; i < data.length; i++) 
        {

            // No greater than 15 Objects a Page
            if (i > 15 && Page == 1)
                continue;
            else if (Page > 1 && i < ((Page * 15) - 15))
                continue;
            else if (i > (15 * Page))
                continue;

            // Skip empty results
            if (sort[i] == null)
                continue;

            let index = sort[i].Index;

            let isKeyword = false;
            if (customSearch)
            {
                for (let j = 0; j < data[index]['keywords'].length; j++)
                {
                    if (getSearch() == data[index]['keywords'][j])
                        isKeyword = true;
                }

                if (!isKeyword)
                    continue;
            }

            var Info = 
            {
                "Name" : (data[index]['First'] + " " + data[index]['Last']),
                "Email" : data[index]['email'],
                "Title" : data[index]['article_title'],
                "Journal" : data[index]['journal'],
                "Day" : data[index]['day'],
                "Month" : data[index]['month'],
                "Year" : data[index]['year'],
                "DOI" : data[index]['doi'],
                "Keywords" : data[index]['keywords'],
                "File" : data[index]['file'],
                "Rating" : CalcRating(data[i]['rating']),
            }

            createPodCastCard(Info); 
        }
    });
};


let initUploadedPodcasts = () => 
{
    if (cardContainer) 
    {
        document.getElementById('UploadedPodCast-card').replaceWith(cardContainer);
        return;
    }

    $.getJSON(podcastDB, function(data)
    {
        cardContainer = document.getElementById('UploadedPodCast-card');

        // Sort //
        var current = new Date();
        var dd = String( current.getDate()).padStart(2, '0');
        var mm = String( current.getMonth() + 1).padStart(2, '0');
        var yyyy =  current.getFullYear();
        let curDate = new Date(yyyy, mm, dd);
        console.log(curDate);

        let sort = [];
        for (let i = 0; i < data.length; i++)
        {
            sort[i] = 
            {
                "Date" : new Date(data[i]['year'], data[i]['month'], data[i]['day']),
                "Index" : i,
            };
        }
        console.log(sort);

        // Newest First
        sort.sort((date1, date2) => date2.Date - date1.Date);

        console.log(sort);
        // Done Sorting //

        console.log(data);
        for (let i = 0; i < data.length; i++) 
        {
            // Skip empty results
            if (sort[i] == null)
                continue;

            let index = sort[i].Index;

            // Don't Render if not the authors
            if (data[index]['email'] != localStorage.getItem('Email'))
                continue;

            var Info = 
            {
                "Name" : (data[index]['First'] + " " + data[index]['Last']),
                "Email" : data[index]['email'],
                "Title" : data[index]['article_title'],
                "Journal" : data[index]['journal'],
                "Day" : data[index]['day'],
                "Month" : data[index]['month'],
                "Year" : data[index]['year'],
                "DOI" : data[index]['doi'],
                "Keywords" : data[index]['keywords'],
                "File" : data[index]['file'],
                "Rating" : CalcRating(data[i]['rating']),
            }
            console.log(CalcRating(data[i]['rating']));

            createPodCastCard(Info); 
        }
    });
};

let initSavedPodcasts = () => 
{
    if (cardContainer) 
    {
        document.getElementById('SavedPodCast-card').replaceWith(cardContainer);
        return;
    }

    $.getJSON(podcastDB, function(data)
    {
        cardContainer = document.getElementById('SavedPodCast-card');

        // Sort //
        var current = new Date();
        var dd = String( current.getDate()).padStart(2, '0');
        var mm = String( current.getMonth() + 1).padStart(2, '0');
        var yyyy =  current.getFullYear();
        let curDate = new Date(yyyy, mm, dd);
        console.log(curDate);

        let sort = [];
        for (let i = 0; i < data.length; i++)
        {
            sort[i] = 
            {
                "Date" : new Date(data[i]['year'], data[i]['month'], data[i]['day']),
                "Index" : i,
            };
        }
        console.log(sort);

        // Newest First
        sort.sort((date1, date2) => date2.Date - date1.Date);

        console.log(sort);
        // Done Sorting //

        console.log(data);
        for (let i = 0; i < data.length; i++) 
        {
            // Skip empty results
            if (sort[i] == null)
                continue;

            let index = sort[i].Index;

            let isSaved = false;
            let savedArray = JSON.parse(localStorage.getItem('Saved'));
            console.log(savedArray);
            // Don't Render if not saved
            for (let j = 0; j < savedArray.length; j++)
            {
                if (data[index]['doi'] == savedArray[j])
                    isSaved = true;
            }

            if (!isSaved)
                continue;

            var Info = 
            {
                "Name" : (data[index]['First'] + " " + data[index]['Last']),
                "Email" : data[index]['email'],
                "Title" : data[index]['article_title'],
                "Journal" : data[index]['journal'],
                "Day" : data[index]['day'],
                "Month" : data[index]['month'],
                "Year" : data[index]['year'],
                "DOI" : data[index]['doi'],
                "Keywords" : data[index]['keywords'],
                "File" : data[index]['file'],
                "Rating" : CalcRating(data[i]['rating']),
            }

            createPodCastCard(Info); 
        }
    });
};

if (getCurrentPage() == 'account.html')
{
    initUploadedPodcasts();
    initSavedPodcasts();
}
else
    initListOfPodCasts();
