document.addEventListener("DOMContentLoaded", function() {
    
    var xhr = new XMLHttpRequest();
    
    function getSelectionText(){
        var selectedText = "";
        if (window.getSelection){
            selectedText = window.getSelection().toString()
        }
        return selectedText
    }
    document.addEventListener('mouseup', function(){
        var text = getSelectionText();
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
                            console.log(JSON.parse(xhr.responseText));
                            var cardInfo = JSON.parse(xhr.responseText);
                            var meanings = document.getElementById('meanings');
                            function getMeaningsContent () {
                                var meaningContent = [];
                                var errorMessage = "Sorry, we don't have translation right now";
                                if (typeof cardInfo !== 'undefined' && cardInfo.length > 0){
                                    for (var i = 0; i< cardInfo[0].meanings.length; i ++ ){
                                        meaningContent[i] =  cardInfo[0].meanings[i].translation;
                                        if(meaningContent[i]==""){
                                            meaningContent[i]= "No translation"
                                        }else{}
                                    }
                                }else{
                                    meaningContent = meaningContent.toString() + errorMessage;
                                }
                                return meaningContent;
                            }
                            meanings.innerHTML = getMeaningsContent();
                            meanings.classList.add('showCard');
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


