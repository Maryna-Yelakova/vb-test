document.addEventListener("DOMContentLoaded", function() {
    

    var cardModel = {
        cardInfo: [],
        meaningContent: [],
        currentMeaningId: 0,
        currentOriginWord: '',
        changeCurrentMeaning: function (meaningId) {
            this.currentMeaningId = meaningId;
        },
        updateMeanings: function(xhr_resp){
            cardModel.cardInfo = JSON.parse(xhr_resp);
            cardModel.getMeaningsContent();
        },
        requestCurrentWord: function(word){
            this.currentOriginWord = word;
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'http://dictionary.skyeng.ru/api/v2/search-word-translation?text=mother' + '&text='+ word, true);
                xhr.onload = function () {
                    if (this.status >= 200 && this.status < 300) {
                        resolve(xhr.response);
                    } else {
                        reject({
                            status: this.status,
                            statusText: xhr.statusText
                        });
                    }
                };
                xhr.onerror = function () {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                };
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send();
            })
        },
        getMeaningsContent: function  () {
            this.meaningContent = [];
            if (typeof this.cardInfo !== 'undefined' && this.cardInfo.length > 0){
                for (var i = 0; i< this.cardInfo[0].meanings.length; i ++ ){
                    this.meaningContent[i] =  {
                        meaning:this.cardInfo[0].meanings[i].translation,
                        image:this.cardInfo[0].meanings[i].preview_image_url
                    };
                    if(this.meaningContent[i]==""){
                        this.meaningContent[i]= "No translation"
                    }else{}
                }
            }else{
                this.meaningContent[0] = {
                    meaning: "Sorry, we don't have translation right now",
                    image: ''
                };
            }
            this.changeCurrentMeaning(0);
        }

    };

    var cardView = {
        meanings: document.getElementById('meanings'),
        card: document.getElementById('card'),
        image: document.getElementById('image'),
        nextMeaning: document.createElement('div'),
        nextMeaningImage: document.createElement('img'),
        originWord: document.getElementById('originWord'),
        depictCard: function () {
            this.meanings.innerHTML = '';
            this.nextMeaning.innerHTML = '';
            this.nextMeaningImage.src = '';
            this.originWord.innerHTML = '';
            this.originWord.innerHTML = cardModel.currentOriginWord;
            this.nextMeaningImage.src = cardModel.meaningContent[0].image;
            this.image.replaceChild(this.nextMeaningImage, this.image.childNodes[0]);
            for (var j = 0; j < cardModel.meaningContent.length; j++) {
                this.nextMeaning.innerHTML += '<div class="meaningItem" id="' + j + '">' + cardModel.meaningContent[j].meaning + '</div>';
                this.meanings.appendChild(this.nextMeaning);
                this.nextMeaning.classList.add('translate-word');
            }
        },
        updateCoordinates: function (coordinate) {
             this.card.style.top = coordinate.top + 'px';
             this.card.style.left = coordinate.left + 'px';
        },
        showWordCard: function () {
            this.card.classList.toggle('hidden',false);
        },
        hideCard: function () {
            this.card.classList.toggle('hidden',true);
        },
        isClickInside: function (target) {
            return cardView.card.contains(target);
        },
        changeMeaningImage: function () {
            this.nextMeaningImage.src = cardModel.meaningContent[cardModel.currentMeaningId].image;
            this.image.replaceChild(this.nextMeaningImage, this.image.childNodes[0]);
        }
       
    };
    
    document.addEventListener('mouseover', function(event) {
        if(event.target.classList.contains('meaningItem')) {
           cardModel.changeCurrentMeaning(event.target.id);
           cardView.changeMeaningImage();
        }
        
        
    });
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
        var currenrSelection = getSelectionText();
        var text = currenrSelection[0];
        if (text.length > 0) {
            var textArr = text.split(' ');
            var word;
            if (textArr[0].toString() !== '') {
                word = textArr[0].toString();
            } else {
                word = textArr[1].toString();
            }
            if (word) {
                cardModel.requestCurrentWord(word)
                    .then(function(data){
                        cardModel.updateMeanings(data);
                        cardView.depictCard();
                        cardView.updateCoordinates(currenrSelection[1]);
                        cardView.showWordCard();
                    })
        
            }
        }
    }, false);
    document.addEventListener('mousedown', function(event) {
        if (!cardView.isClickInside(event.target)) {
            cardView.hideCard();
        }
    });
});


