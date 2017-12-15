Array.prototype.shuffle = function() {
  var i = this.length, j, temp;
  while(--i > 0){
      j = Math.floor(Math.random() * (i+1));
      temp = this[j];
      this[j] = this[i];
      this[i] = temp;
  }
}

/*var aqua = '#40c8c4';
var light_blue = '#4c98cf';
var blue = '#4873a6';
var light_purple = '#595386';
var _purple = '#524364'; */


/* Arshad Muhammed */
$(function() {

    var anim_id;
    var topic;
    var questions;

    //saving dom objects to variables
    var container = $('#container');
    var car = $('#car');
    var car_1 = $('#car_1');
    var car_2 = $('#car_2');
    var car_3 = $('#car_3');
    var line_1 = $('#line_1');
    var line_2 = $('#line_2');
    var line_3 = $('#line_3');
    var restart_div = $('#restart_div');
    var topics_div = $('#topics_div');
    var topics_form = $('#topics_form')
    var question_form = $('#question_form');
    var otro_btn = $('#otro');
    var score = $('#score');

    //saving some initial setup
    var container_left = parseInt(container.css('left'));
    var container_width = parseInt(container.width());
    var container_height = parseInt(container.height());
    var car_width = parseInt(car.width());
    var car_height = parseInt(car.height());

    //some other declarations
    var game_over = true;

    var score_counter = 1;

    var speed = 2;
    var line_speed = 5;

    var move_right = false;
    var move_left = false;
    var move_up = false;
    var move_down = false;

    var retries = 0;

    setBgColor();
    getTopics();

    /* ------------------------------MISC CODE STARTS HERE------------------------------------------- */

    function setBgColor() {
        var colors = [
            'aqua',
            'light_blue',
            'blue',
            'light_purple',
            'purple'
        ];
        colors.shuffle();
        var bgColor = colors.pop();

        $('body').addClass(bgColor);
        topics_div.addClass(bgColor);
        restart_div.addClass(bgColor);
    }

    /* ------------------------------MISC CODE STARTS HERE------------------------------------------- */

    /* ------------------------------GAME CODE STARTS HERE------------------------------------------- */

    /* Move the cars */
    $(document).on('keydown', function(e) {
        if (game_over === false) {
            var key = e.keyCode;
            if (key === 37 && move_left === false) {
                move_left = requestAnimationFrame(left);
            } else if (key === 39 && move_right === false) {
                move_right = requestAnimationFrame(right);
            } else if (key === 38 && move_up === false) {
                move_up = requestAnimationFrame(up);
            } else if (key === 40 && move_down === false) {
                move_down = requestAnimationFrame(down);
            }
        }
    });

    $(document).on('keyup', function(e) {
        if (game_over === false) {
            var key = e.keyCode;
            if (key === 37) {
                cancelAnimationFrame(move_left);
                move_left = false;
            } else if (key === 39) {
                cancelAnimationFrame(move_right);
                move_right = false;
            } else if (key === 38) {
                cancelAnimationFrame(move_up);
                move_up = false;
            } else if (key === 40) {
                cancelAnimationFrame(move_down);
                move_down = false;
            }
        }
    });

    $('.mobile-key').on('mousedown', function(e) {
        if (game_over === false) {
            var key = $(this).attr('id');
            console.log('mousedown', key);
            if (key === "left" && move_left === false) {
                move_left = requestAnimationFrame(left);
            } else if (key === "right" && move_right === false) {
                move_right = requestAnimationFrame(right);
            } else if (key === "up" && move_up === false) {
                move_up = requestAnimationFrame(up);
            } else if (key === "down" && move_down === false) {
                move_down = requestAnimationFrame(down);
            }
        }
    });

    $('.mobile-key').on('mouseup', function(e) {
        if (game_over === false) {
            var key = $(this).attr('id');
            console.log('mouseup', key);
            if (key === "left") {
                cancelAnimationFrame(move_left);
                move_left = false;
            } else if (key === "right") {
                cancelAnimationFrame(move_right);
                move_right = false;
            } else if (key === "up") {
                cancelAnimationFrame(move_up);
                move_up = false;
            } else if (key === "down") {
                cancelAnimationFrame(move_down);
                move_down = false;
            }
        }
    });

    function left() {
        if (game_over === false && parseInt(car.css('left')) > 0) {
            car.css('left', parseInt(car.css('left')) - 5);
            move_left = requestAnimationFrame(left);
        }
    }

    function right() {
        if (game_over === false && parseInt(car.css('left')) < container_width - car_width) {
            car.css('left', parseInt(car.css('left')) + 5);
            move_right = requestAnimationFrame(right);
        }
    }

    function up() {
        if (game_over === false && parseInt(car.css('top')) > 0) {
            car.css('top', parseInt(car.css('top')) - 3);
            move_up = requestAnimationFrame(up);
        }
    }

    function down() {
        if (game_over === false && parseInt(car.css('top')) < container_height - car_height) {
            car.css('top', parseInt(car.css('top')) + 3);
            move_down = requestAnimationFrame(down);
        }
    }

    function repeat() {
        if (collision(car, car_1) || collision(car, car_2) || collision(car, car_3) || game_over) {
            stop_the_game();
            return;
        }

        score_counter++;

        if (score_counter % 20 == 0) {
            score.text(parseInt(score.text()) + 1);
        }
        if (score_counter % 500 == 0) {
            speed++;
            line_speed++;
        }

        car_down(car_1);
        car_down(car_2);
        car_down(car_3);

        line_down(line_1);
        line_down(line_2);
        line_down(line_3);

        anim_id = requestAnimationFrame(repeat);
    }

    function car_down(car) {
        var car_current_top = parseInt(car.css('top'));
        if (car_current_top > container_height) {
            car_current_top = -200;
            var car_left = parseInt(Math.random() * (container_width - car_width));
            car.css('left', car_left);
        }
        car.css('top', car_current_top + speed);
    }

    function line_down(line) {
        var line_current_top = parseInt(line.css('top'));
        if (line_current_top > container_height) {
            line_current_top = -300;
        }
        line.css('top', line_current_top + line_speed);
    }

    question_form.submit(function(e) {
        e.preventDefault();
        var answer = $('#answers').val();
        if (!answer) {
            return;
        }
        if (answer != 100) {
            $('.error').show();
            retries++;
            if(retries == 3) {
                askQuestion();
            }
            return;
        }
        restart_the_game();
    });

    topics_form.submit(function(e) {
        e.preventDefault();
        topic = $('#topics').val();
        if (!topic) {
            return;
        }
        getQuestions();
    });

    function stop_the_game() {
        askQuestion();
        cancelAnimationFrame(anim_id);
        cancelAnimationFrame(move_right);
        cancelAnimationFrame(move_left);
        cancelAnimationFrame(move_up);
        cancelAnimationFrame(move_down);
    }

    function restart_the_game() {
        //location.reload();
        game_over = false;
        retries = 0;
        score_counter = 1;
        speed = 2;
        line_speed = 5;
        score.text(0);
        car.css('bottom', '8%');
        car_1.css('top', -250);
        car_2.css('top', -350);
        car_3.css('top', -400);
        topics_div.slideUp();
        restart_div.slideUp();
        anim_id = requestAnimationFrame(repeat);
    }

    function collision($div1, $div2) {
        var x1 = $div1.offset().left;
        var y1 = $div1.offset().top;
        var h1 = $div1.outerHeight(true);
        var w1 = $div1.outerWidth(true);
        var b1 = y1 + h1;
        var r1 = x1 + w1;
        var x2 = $div2.offset().left;
        var y2 = $div2.offset().top;
        var h2 = $div2.outerHeight(true);
        var w2 = $div2.outerWidth(true);
        var b2 = y2 + h2;
        var r2 = x2 + w2;

        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
        return true;
    }

    otro_btn.on('click', function() {
        location.reload();
    })

    /* ------------------------------GAME CODE ENDS HERE------------------------------------------- */

    /* ------------------------------QUESTIONS CODE STARTS HERE------------------------------------------- */
    function getTopics() {
        $.ajax({
            type: "GET",
            url: "https://bioquimica-games.firebaseio.com/opcionMultiple.json",
            success: function(data) {
                var temas = data;
                temas.forEach(function(t) {
                    var option = '<option value="' + t.tema +'" class="option">' + t.tema +'</option>'
                    $('#topics').append(option);
                })
                topics_div.slideDown();
                $('#topics').focus();
            },
            error: function(err) {
                console.log(err)
            }
        });
    }
    function getQuestions() {
        // Peticion para obtener preguntas de la db;
        $.ajax({
            type: "GET",
            url: "https://bioquimica-games.firebaseio.com/opcionMultiple.json",
            success: function(data) {
                if (!topic) {
                    //location.reload();
                }

                var topics = data;
                var t = topics.find(function(t) {
                    return t.tema == topic;
                });
                if (!t) {
                    //location.reload();
                }

                // Guardar las preguntas en el array
                questions = t.preguntas;
                // Si no hay preguntas, recargar pagina
                if (!questions.length) {
                    //location.reload();
                }
                // Revolver preguntas
                questions.shuffle();

                /* Move the cars and lines */
                anim_id = requestAnimationFrame(repeat);
            },
            error: function(err) {
                console.log(err)
            }
        });
    }

    function askQuestion(argument) {
        // Si ya no hay preguntas, pedirlas nuevamente a la db
        if(!questions.length) {
            getQuestions();
        } else{
            // Limpiar el div de preguntas y el select de respuestas
            $('#q').text();
            $('#answers').val(0);
            $('.option').remove();

            // Obtener una pregunta del array
            var q = questions.pop()

            // Escribir la pregunta en el div de pregunta
            $('#q').text(q.pregunta);

            // Revolver la respuestas
            q.respuestas.shuffle();

            // Escribir cada posible respuesta en el select de respuestas
            q.respuestas.forEach(function(p, i) {
                var value = p == q.correcta ? 100 : i + 1;
                var option = '<option value="' + value +'" class="option">' + p +'</option>'
                $('#answers').append(option);
            });

            // Mostrar el div de pregunta y enfocar el select
            restart_div.slideDown();
            $('#answers').focus();
        }
    }
    /* ------------------------------QUESTION CODE ENDS HERE------------------------------------------- */
});
