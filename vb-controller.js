document.addEventListener("DOMContentLoaded", function() {
    
    var xhr = new XMLHttpRequest();
    var meanings = document.getElementById('meanings');
    var card = document.getElementById('card');
    var image = document.getElementById('image');
    var nextMeaning = document.createElement('div');
    var nextMeaningImage = document.createElement('img');
    var originWord = document.getElementById('originWord');

    function getSelectionText(){
        var selectedText = "";
        var selected, oRange, oRect;
        if (window.getSelection){
            selected = window.getSelection();
            selectedText = selected.toString();
            oRange = selected.getRangeAt(0); 
            oRect = oRange.getBoundingClientRect();
        }
        return [selectedText,oRect];
    }

    
    document.addEventListener('mouseup', function(){
        var text = getSelectionText()[0];
        if (text.length > 0){
            var textArr = text.split(' ');
            var word;
            if (textArr[0].toString() !== ''){
                 word = textArr[0].toString();
            } else{
                 word = textArr[1].toString();
            }
            if(word){
                xhr.open('GET', 'http://dictionary.skyeng.ru/api/v2/search-word-translation?text=mother' + '&text='+ word, true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        if(xhr.status == 200) {
                            var cardInfo = JSON.parse(xhr.responseText);
                            function getMeaningsContent () {
                                var meaningContent = [];
                                if (typeof cardInfo !== 'undefined' && cardInfo.length > 0){
                                    for (var i = 0; i< cardInfo[0].meanings.length; i ++ ){
                                        meaningContent[i] =  {
                                            meaning:cardInfo[0].meanings[i].translation,
                                            image:cardInfo[0].meanings[i].preview_image_url,
                                            id:cardInfo[0].meanings[i].id
                                        };
                                        if(meaningContent[i]==""){
                                            meaningContent[i]= "No translation"
                                        }else{}
                                    }
                                    return meaningContent;
                                }else{
                                    return "Sorry, we don't have translation right now";
                                }
                            }
                            var content = getMeaningsContent();
                            if(content != "Sorry, we don't have translation right now"){
                                getCardResult();
                            }
                            else {
                                meanings.innerHTML = "Sorry, we don't have translation right now";
                            }
                            function getCardResult (){
                                meanings.innerHTML = '';
                                nextMeaning.innerHTML = '';
                                nextMeaningImage.src = '';
                                originWord.innerHTML = '';
                                for (var j = 0; j < content.length; j++ ){
                                    var item = content[j];
                                   
                                    nextMeaning.innerHTML += '<p>'+ item.meaning + '</p>';
                                    meanings.appendChild(nextMeaning);
                                    nextMeaningImage.src = item.image;
                                    image.replaceChild(nextMeaningImage, image.childNodes[0]);
                                    originWord.innerHTML = word;
                                    nextMeaning.classList.add('translate-word');
                                    
                                }
                            }
                            var coordinate = getSelectionText()[1];
                            console.log(coordinate.top, coordinate.left);
                            card.style.top = coordinate.top + 'px';
                            card.style.left = coordinate.left + 'px';
                            card.classList.remove('hidden');
                            card.classList.add('showCard');
                        }else {
                            alert( 'Error: ' + (this.status ? this.statusText : 'Query was not successful') );
                        }
                    }
                };
                xhr.send();
            } else{
                
            }
        }
    }, false);
});


