var $currentPage, $nextPage;

$board = $("[data-component='board']");
$newBoard= '<tr></tr><tr></tr><tr></tr><tr></tr>';
$backButton = $("[data-component='back-button']");
$initialForm = $("[data-component='initial-form']");
$nextLevel = $('[data-component="next-level"]')

activeClass = 'is-active';
flippedClass = 'is-flipped';
matchedClass = 'is-matched';

hiddenClass = 'is-hidden';
visibleClass = 'is-visible';

toLeftClass = 'ui-page--move-to-left';
toRightClass = 'ui-page--move-to-right';

fromLeftClass = 'ui-page--move-from-left';
fromRightClass = 'ui-page--move-from-right';

slideInFadeClass = 'ui-board--slide-in-fade';

delayFlipBackTime = 2000;

$(document).ready(onDocumentReady);
$initialForm.submit(startGame);
$backButton.click(restart);
$nextLevel.click(restart);

Array.prototype.shuffle = function() {
  var i = this.length, j, temp;
  while(--i > 0){
      j = Math.floor(Math.random() * (i+1));
      temp = this[j];
      this[j] = this[i];
      this[i] = temp;
  }
}

$('.ui-board').on('click', 'td', function(e){
  if ($('.' + flippedClass).length > 1) {
    var flippedCounter = $('.' + flippedClass).filter(function() {
      return !$(this).hasClass(matchedClass);
    });
    if (flippedCounter.length > 1) {
      return false;
    }
  }
  var $target = $( e.target ), $parent;
  if ( $target.is( "span" ) ) {
    $parent = $( $target.parent().parent()[0] );
  }
  if ( $target.is( "figure" ) ) {
    $parent = $( $target.parent()[0] );
  }
  if ($parent.hasClass(flippedClass)) {
    return false;
  }
  $parent
    .addClass(activeClass)
    .addClass(flippedClass);
  $flippedCards = $('.' + flippedClass).filter(function() {
    return !$(this).hasClass(matchedClass);
  });
  if ($flippedCards.length > 1) {
    if ($flippedCards[0].id == $flippedCards[1].id) {
      $flippedCards.addClass(matchedClass);
      $numberOfMatchedCards = $('.' + matchedClass).length;
      $numberOfCards = $('.ui-board td').length;
      if ($numberOfMatchedCards == $numberOfCards) {
        setTimeout(win, delayFlipBackTime);
      }
      return true;
    }
    setTimeout(function() {
      $flippedCards.each(function() {
        if ($(this).hasClass(matchedClass)) {
          return false;
        }
        $(this)
          .removeClass(activeClass)
          .removeClass(flippedClass);
      });
    }, delayFlipBackTime);
  }
});

function onDocumentReady() {
  $currentPage = $(".ui-page--primary");
  $nextPage = getNextPage();
  console.log($nextPage);
  getTemas();
}

function startGame(event) {
  event.preventDefault();
  var $select = $("[name='level']");
  var filtro = $($select).val();
  resetBoard();
  if (!filtro) {
    return false;
  }
  getCards(filtro);
}

function hideCurrentPage(name) {
  var animation = isPrevious() ? toLeftClass : toRightClass;
  $currentPage
    .addClass(animation);
}

function showCurrentPage() {
  $currentPage.addClass(visibleClass);
}

function showNextPage(callback) {
  var animation = isPrevious() ? fromRightClass : fromLeftClass;
  //callback = once(callback, this);

  $nextPage
    .addClass(animation)
    .addClass(visibleClass);
    //.one(animationEnd, callback);
  removePageClasses($currentPage);
  $currentPage = $nextPage;
  toggleBackButton();
}

function setCurrentPage() {
  $currentPage = getCurrentPage();
}

function getNextPage() {
  var currentIndex = $currentPage.data('page-index');
  return currentIndex < 2
    ? $("[data-page-index='" + (currentIndex + 1) +"']")
    : undefined;
}

function getPreviousPage() {
  var currentIndex = $currentPage.data('page-index');
  return currentIndex > 0
    ? $("[data-page-index='" + (currentIndex - 1) + "']")
    : undefined;
}

function isPrevious() {
  return $currentPage.data('page-index') < $nextPage.data('page-index');
}


function getCurrentPage() {
  return $('[data-page-name].is-visible');
}

function toggleBackButton() {
  if ($currentPage.data('page-index') > 0) {
    $backButton.removeClass(hiddenClass);
  } else {
    $backButton.addClass(hiddenClass);
  }
}

function clickBackButton(event) {
  event.preventDefault();
  $nextPage = $(".ui-page--primary");
  hideCurrentPage();
  showNextPage();
  $nextPage = getNextPage();
}

function removePageClasses($target) {
  $target
    .removeClass(toLeftClass)
    .removeClass(toRightClass)
    .removeClass(fromLeftClass)
    .removeClass(fromRightClass);
}

function createUUID() {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

function resetBoard() {
  $board.removeClass(slideInFadeClass);
  $board.html($newBoard);
  $($board.parent().parent()).one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
    function(e) {
      $board.addClass(slideInFadeClass);
    }
  );
}

function win() {
  $nextPage = getNextPage();
  showNextPage();
}

function getTemas() {
  $.ajax({
    type: "GET",
    url: "https://bioquimica-match.firebaseio.com/.json",
    success: function(data) {
      console.log(data);
      $select = $("[name='level']")[0];
      data.forEach(function(level) {
        $opt = '<option value="' + level.tema.toLowerCase() + '">'+ level.tema +'</option>';
        $($select).append($opt);
      })
      showCurrentPage();
    },
    error: function(err) {
      console.log(err)
    }
  });
}

function getCards(filtro) {
  $.ajax({
    type: "GET",
    url: "https://bioquimica-match.firebaseio.com/.json",
    success: function(data) {
      console.log(data);
      var tema = data.find(function(t) {
        return t.tema.toLowerCase() == filtro;
      });
      var cartas = [];
      tema.cartas.forEach(function(c) {
        var uuid = createUUID();
        c.forEach(function(cc) {
          cartas.push({
            id: uuid,
            contenido: cc.contenido,
            tipo: cc.tipo
          });
        });
      });
      cartas.shuffle();
      $trs = $('.ui-board tr');
      cartas.forEach(function(c, i) {
        var carta = '<td id="' + c.id + '">'
          + '<figure class="is-back ui-inputs"><span>'+ c.contenido +'</span></figure>'
          + '<figure class="is-front ui-inputs"></figure>'
          + '</td>';
        $parent = $trs[Math.floor(i/5)];
        $($parent).append(carta);
      });
      hideCurrentPage();
      showNextPage();
    },
    error: function(err) {
      console.log(err)
    }
  });
}

function restart() {
  location.reload();
}
