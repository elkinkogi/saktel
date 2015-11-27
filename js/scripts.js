var lastSection = null,
        enterSection = 1,
        transition = '',
        animation = '',
        animationCreated = false,
        el = document.createElement('div'),
        ismobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i),
        zIndex = navigator.userAgent.match(/(android)/i) ? '200' : '10',
        slowBarInterval = null,
        coinsTimer = null,
        audios = {
            icon1: null,
            icon2: null,
            icon3: null
        },
        rows = 0;

var self = null;
var animateSprite = null;
var Sprite = function(data) {
    self = this;
    this.cnv = document.getElementById(data.id);
    this.ctx = this.cnv.getContext('2d');
    this.tx = data.tx;
    this.ty = data.ty;
    this.cx = 0;
    this.cy = 0;
    this.x = 0;
    this.y = 0;
    this.img = null;
    this.sprite = data.sprite;
    this.itSprite = null;
    this.infinite = data.infinite;
    this.loadSprite();
    this.callback = null;
};

Sprite.prototype.draw = function() {
    this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
    this.ctx.drawImage(this.img, (this.img.width / this.tx) * this.cx, (this.img.height / this.ty) * this.cy, (this.img.width / this.tx), (this.img.height / this.ty), this.x, this.y, this.cnv.width, this.cnv.height);
    this.cx++;
    if (this.cx === this.tx) {
        this.cx = 0;
        this.cy++;
        rows++;
        //if (!this.infinite) {
        if (rows == this.ty) {
            clearInterval(this.itSprite);
            if (this.callback !== null) {
                this.callback();
            }
        }
    }

    if (this.cy === this.ty) {
        this.cy = 0;
    }
};

Sprite.prototype.loadSprite = function() {
    this.img = new Image();
    this.img.src = this.sprite;
    this.img.onload = function() {
        console.log('sprite loaded');
    };
};

Sprite.prototype.init = function(callback) {
    if (callback) {
        this.callback = callback;
    }

    this.itSprite = setInterval(function() {
        self.draw();
    }, 20);
};

Sound = function(data) {
    this.audio = new Audio();
    this.audio.src = data.src;
    this.audio.autoplay = false;
};

Sound.prototype.play = function() {
    this.audio.play();
};

function getRotationDegrees(obj) {
    var matrix = obj.css("-webkit-transform") ||
            obj.css("-moz-transform") ||
            obj.css("-ms-transform") ||
            obj.css("-o-transform") ||
            obj.css("transform");
    if (matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    } else {
        var angle = 0;
    }
    return (angle < 0) ? angle += 360 : angle;
}

function transitionEvent() {
    var t;
    var transitions = {
        'transition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'MozTransition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd',
        'MsTransition': 'msTransitionEnd'
    };

    for (t in transitions) {
        if (el.style[t] !== undefined) {
            return transitions[t];
        }
    }
}

function animationEvent() {
    var t;
    var animations = {
        'animation': 'animationend',
        'OAnimation': 'oAnimationEnd',
        'MozAnimation': 'animationend',
        'WebkitAnimation': 'webkitAnimationEnd',
        'MsAnimation': 'msAnimationEnd'
    };
    for (t in animations) {
        if (el.style[t] !== undefined) {
            return animations[t];
        }
    }
   
}

function updateOrientation() {
    if (Math.abs(window.orientation) === 0 || Math.abs(window.orientation) === 180) {
        $('#landscape').css('opacity', '0');
        $('#portrait').show();
    } else {
        $('#portrait').hide();
        if (!animationCreated) {
            setTimeout(function() {
                var obj = document.getElementById('sprite');
                var widthCanvas = $('#wrapper').width();
                var heightCanvas = $('#container-dark-sprites .animate-center img').height();
                obj.setAttribute("width", widthCanvas);
                obj.setAttribute("height", heightCanvas);
                animateSprite = new Sprite({
                    id: 'sprite',
                    tx: 12,
                    ty: 3,
                    sprite: 'images/sprite_v1-1-1.png',
                    infinite: false
                });
                $('#iphone-mockup, #landscape').css('opacity', '1');
                if ($('#iphone-mockup').is(':visible')) {
                    $('#iphone-mockup').bind(transition, function() {
                        $(this).unbind(transition);
                        startAnimation();
                    });
                } else {
                    startAnimation();
                }
                /*var role = '1-2';
                 lastSection = '1-2';
                 $('#section-' + role).fadeIn('fast', function() {
                 $('#section-' + role).css('opacity', '1');
                 $('#section-' + role).bind(transition, function() {
                 $(this).unbind(transition);
                 youtubeAnimation();
                 });
                 });*/
            }, 500);
        } else {
            $('#landscape').css({
                '-webkit-transition': '0s linear',
                '-ms-transition': '0s linear',
                '-moz-transition': '0s linear'
            });
            $('#landscape').css('opacity', '1');
        }
    }
}

function resetRayBestPosition() {
    $('#best-network').css({
        '-webkit-transform': 'scale(1)',
        '-ms-transform': 'scale(1)',
        '-moz-transform': 'scale(1)'
    });
    $('#rays').css({
        '-webkit-transform': 'scale(1)',
        '-ms-transform': 'scale(1)',
        '-moz-transform': 'scale(1)'
    });

    if (enterSection === 3) {
        $('#rays img').css('top', '-60px');
        $('#best-network img').css('top', '-109px');
    }
}

function resetScaleRayBest() {
    $('#best-network, #rays').css({
        '-webkit-transition': '0s linear',
        '-ms-transition': '0s linear',
        '-moz-transition': '0s linear',
        '-webkit-transform': 'scale(0)',
        '-ms-transform': 'scale(0)',
        '-moz-transform': 'scale(0)'
    });

    if (enterSection === 3) {
        $('#rays img').css('top', '-5px');
        $('#best-network img').css('top', '0');
    }
}

function scaleRayBest(callback) {
    $('#container-menu').css({
        '-webkit-transition': '1s linear',
        '-ms-transition': '1s linear',
        '-moz-transition': '1s linear',
        'display': 'block',
        'opacity': '1'
    });
    $('#best-network, #rays').css({
        '-webkit-transition': '1.5s linear',
        '-ms-transition': '1.5s linear',
        '-moz-transition': '1.5s linear'
    });

    setTimeout(function() {
        $('#rays').css({
            '-webkit-transform': 'scale(3)',
            '-ms-transform': 'scale(3)',
            '-moz-transform': 'scale(3)'
        });
        setTimeout(function() {
            $('#best-network').css({
                '-webkit-transform': 'scale(3)',
                '-ms-transform': 'scale(3)',
                '-moz-transform': 'scale(3)'
            });

            setTimeout(function() {
                if (callback) {
                    callback();
                }
            }, 500);
        }, 500);
    }, 100);
}

function hideRayBest(callback) {
    $('#container-menu').css({
        '-webkit-transition': '1.5s linear',
        '-ms-transition': '1.5s linear',
        '-moz-transition': '1.5s linear'
    });
    setTimeout(function() {
        $('#container-menu').css('opacity', '0');
        $('#container-menu').bind(transition, function() {
            $(this).unbind(transition);
            setTimeout(function() {
                resetRayBestPosition();
                if (callback) {
                    callback();
                }
            }, 500);
        });
    }, 500);
}

function endGlobalTransition() {
    if (enterSection === 3) {
        $('#section-2').show();
    }
    setTimeout(function() {
        $('#section-' + lastSection).css('opacity', '0');
        $('#section-' + lastSection).bind(transition, function() {
            $(this).unbind(transition);
            $('#section-' + lastSection).fadeOut('fast');
            $('#container-menu').fadeIn('fast', function() {
                $('#section-1').show();
                if (enterSection === 3) {
                    $('#section-2').css('opacity', '1');
                }
                $('#container-menu').css('opacity', '1');
                $('#container-menu').bind(transition, function() {
                    $(this).unbind(transition);
                });
            });
            setTimeout(function() {
                resetAllAnimations();
            }, 100);
        });
    }, 500);
}

function resetAllAnimations() {
    $('#section-' + lastSection).css({
        'display': 'none',
        'opacity': '0'
    });
    $('#section-1-text').hide();
    $('#car-red-container').show();
    $('#car-blue-container, .car-red-gadget').hide();
    $('#car-red, #car-blue').css({
        '-webkit-transform': 'translateX(0%)',
        '-ms-transform': 'translateX(0%)',
        '-moz-transform': 'translateX(0%)'
    });
    $('.car-red-gadget').css({
        '-webkit-transform': 'translateX(0)',
        '-ms-transform': 'translateX(0)',
        '-moz-transform': 'translateX(0)'
    });
    $(".ocultar").hide();

    $('#section-1-2-text3').attr('src', 'images/other-companies2.png');
    $('#section-1-2-text3-1').attr('src', 'images/data-overage-fee.png');
    
    $("#loadingStatus").css({
        'left':'-100%'
    });

    $('#girl-1').show();
    $('#girl-2').hide();
    $('#girl-2-img').css({
        '-webkit-transform': 'translateX(-40px)',
        '-ms-transform': 'translateX(-40px)',
        '-moz-transform': 'translateX(-40px)'
    });
    $('#gadget-1').css('opacity', '1');
    $('#gadget-2').css('opacity', '0');
    //$('.section-1-3-text').hide();
    $('#section-1-3-text-1-1').hide();
    $('#section-1-3-text-1-2').hide();
    
    if (enterSection < 3) {
        enterSection++;
    }
}

function sparkleVisible(sparkle, callback) {
    sparkle.css('opacity', '1');
    sparkle.bind(transition, function() {
        $(this).unbind(transition);
        sparkle.css('opacity', '0');
        sparkle.bind(transition, function() {
            $(this).unbind(transition);
            if (callback) {
                callback();
            }
        });
    });
}

function splarklesAnimation(id, callback) {
    var splarkle1 = $('#' + id + ' .sparkle1');
    var splarkle2 = $('#' + id + ' .sparkle2');
    var splarkle3 = $('#' + id + ' .sparkle3');
    var callbackFlip = function() {
        if (callback) {
            setTimeout(function() {
                callback();
            }, 0);
        }
    };
    if (id === '1-1') {
		setTimeout(function() {
                sparkleVisible(splarkle3, function() {
                    callbackFlip();
                });
            }, 0);
    }

    if (id === '1-2') {
       
            setTimeout(function() {
                sparkleVisible(splarkle3, function() {
                    callbackFlip();
                });
            }, 0);
    }

    if (id === '1-3') {
        sparkleVisible($('.sparkle1'));
        
            setTimeout(function() {
                sparkleVisible(splarkle2, function() {
                    callbackFlip();
                });
            }, 0);
    }
}

function effectFlip() {
    $('#1-1').addClass('effect');
    $('#1-1').bind(transition, function() {
        $(this).unbind(transition);
        setTimeout(function() {
            $('#1-2').addClass('effect');
            $('#1-2').bind(transition, function() {
                $(this).unbind(transition);
                setTimeout(function() {
                    $('#1-3').addClass('effect');
                    $('#1-3').bind(transition, function() {
                        $(this).unbind(transition);
                        splarklesAnimation('1-3', function() {
                            $('#section-1-text, .back').css('opacity', '1');
                            $('#icons-container').addClass('flip');
                            $('#section-1-text').bind(transition, function() {
                                $(this).unbind(transition);
                                setTimeout(function() {
                                    $('#tap-image-shadow').fadeOut('slow');
                                }, 800);
                            });
                        });
                    });
                },550);
            });
        },550);
    });
}

function startAnimation() {
    animationCreated = true;
    $('#intro img, #container-intro-back').css({
        '-webkit-transform': 'scale(1)',
        '-ms-transform': 'scale(1)',
        '-moz-transform': 'scale(1)'
    });
         $('#why-sassket img').css({
            '-webkit-transform': 'scale(1)',
            '-ms-transform': 'scale(1)',
            '-moz-transform': 'scale(1)'
        });
        
    setTimeout(function() {
        
        $('#why-sassket img').bind(transition, function() {
            $(this).unbind(transition);
            setTimeout(function() {
                $('#intro-girl img').css('opacity', '1');
                $('#intro-girl img').bind(transition, function() {
                    $(this).unbind(transition);
                    $('#why-sassket img').css({
                        '-webkit-transition': '1s linear',
                        '-ms-transition': ' 1s linear',
                        '-moz-transition': ' 1s linear'
                    });
                    $('#why-sassket img, #container-intro-back, #intro img').css({
                        '-webkit-transform': 'translateY(10)',
                        '-ms-transform': 'translateY(10)',
                        '-moz-transform': 'translateY(10)'
                    });
                    setTimeout(function() {
                        $('#background-3').css({
                            '-webkit-transform': 'scale(10)',
                            '-ms-transform': 'scale(10)',
                            '-moz-transform': 'scale(10)',
                            'opacity': '1'
                        });
                        $('#background-3').bind(transition, function() {
                            $(this).unbind(transition);
                            $(this).css('opacity', '0');
                        });
                        $('#container-menu').show().css('opacity', '1');
                        setTimeout(function() {
                            $('#background-2, #intro-girl img').css('opacity', '0');
                            $('#why-sassket img, #why-sassket-blue img, #container-intro-back, #intro img').css({
                                '-webkit-transform': 'translateY(-0px)',
                                '-ms-transform': 'translateY(-0px)',
                                '-moz-transform': 'translateY(-0px)'
                            });
                            $('#why-sassket-blue').css('opacity', '1');
                            $('#why-sassket img').bind(transition, function() {
                                $(this).unbind(transition);
                                $('#intro img, #container-intro-back, #why-sassket-blue').css('opacity', '0');
                                $('#intro img').bind(transition, function() {
                                    $(this).unbind(transition);

									 animateSprite.init(function() {
                                            setTimeout(function() {
                                                $('#container-dark-sprites').css('opacity', '1');
                                                $('#container-dark-sprites').bind(transition, function() {
                                                    $(this).unbind(transition);
                                                    $('#container-canvas').css('opacity', '0');
                                                    effectFlip();
                                                    setTimeout(function() {
                                                        $('#container-ligth-sprites').addClass('animate');
                                                    }, 100);
                                                });
                                            }, 170);
                                        });
                                    setTimeout(function() {
										
									$('#why-sassket img, #why-sassket-blue img, #container-intro-back, #intro img').css({
                                '-webkit-transform': 'translateY(-120px)',
                                '-ms-transform': 'translateY(-120px)',
                                '-moz-transform': 'translateY(-120px)'
                            });
								
                                       
                                    }, 30);
                                });
                            });
                        }, 100);
                    }, 100);
                });
            }, 100);
        });
    }, 100);
}

function youtubeAnimation() {
    $("#loadingStatus").animate({
                left: "+=100%"
            },2500);

                        var coins1 = [1, 3, 2, 6, 5];
                        var indexCoin1 = 0;
                        coinsTimer1 = setInterval(function() {
                            $('#coins' + coins1[indexCoin1]).fadeIn();
                            indexCoin1++;
                            if (indexCoin1 > 4) {
                                clearInterval(coinsTimer1);
                            }
                        }, 400);
    
    
    
        setTimeout(function(){
            $("#section-1-2-text3").show();
            setTimeout(function(){
                $("#section-1-2-text3-1").show();
            },700);
        },300);

    setTimeout(function() {
        $("#section-1-2-text3").hide();
        $("#section-1-2-text3-1").hide();
        scaleRayBest(function() {
            $('#section-' + lastSection).css('opacity', '0');
            $('#section-' + lastSection).bind(transition, function() {
                $(this).unbind(transition);
                $('#loadingStatus').css('left', '-100%');
                $('#section-1-2-text3').attr('src', 'images/sasktel2.png'); 
          $('#section-1-2-text3-1').attr('src', 'images/no-data-overage-fees-copy.png');
                
                setTimeout(function(){
                    $("#section-1-2-text3").show();
                    setTimeout(function(){
                        $("#section-1-2-text3-1").show();
                    },700);
                },4000);

                hideRayBest(function() {
                    $('#section-' + lastSection).css('opacity', '1');
                    $('#section-' + lastSection).bind(transition, function() {
                        $(this).unbind(transition);
                        $("#loadingStatus").animate({
                            left: "+=100%"
                        },2500);
                        
                        var coins = [1, 3, 2, 6, 5];
                        var indexCoin = 0;
                        coinsTimer = setInterval(function() {
                            $('#coins' + coins[indexCoin]).fadeOut();
                            indexCoin++;
                            if (indexCoin > 4) {
                                clearInterval(coinsTimer);
                                setTimeout(function() {
                                    endGlobalTransition();
                                }, 650);
                            }
                        }, 400);
                        
                    });
                });
            });
        });
    }, 3000);
}

function carAnimation() {
	
	var eks;
        
            /**$("#section-1-1-text1").css({
                'visibility':'visible'
            },0);
            $("#section-1-1-text1-1").css({
                'visibility':'visible'
            },0); **/
    $("#section-1-1-text1").show();

    setTimeout(function(){
         $("#section-1-1-text1-1").show();
        $('#car-red-container .car-red-gadget').show();
        	
		setInterval(function(){
			$('.car-red-gadget').show(300);
			$('.car-red-gadget').hide(300);
		},500);
		
        },700);
    
    setTimeout(function(){
        setTimeout(function(){
            $("#section-1-1-text2").show();
            setTimeout(function(){
                $("#section-1-1-text2-1").show();
            },600)
        },6000);
        scaleRayBest(function() {
            $('#section-' + lastSection).css('opacity', '0');
            $('#section-' + lastSection).bind(transition, function() {
            $(this).unbind(transition);
            $('#car-red-container').hide();
            $('#car-blue-container').show();
				$("#bigSignal").fadeOut(0);
				$("#medianSignal").fadeOut(0);
				eks = setInterval(function(){
					$("#medianSignal").fadeIn(0);
					$("#bigSignal").fadeIn(500);
					setTimeout(function(){
						$("#medianSignal").fadeOut(0);
						$("#bigSignal").fadeOut(0);
					},700);	
					console.log("Segui");
					},1400);
                hideRayBest(function() {
                    $('#section-' + lastSection).css('opacity', '1');
                    $('#section-' + lastSection).bind(transition, function() {
                    $(this).unbind(transition);
                        
                        $('#car-blue').css({
                        '-webkit-transform': 'translateX(10%)',
                        '-ms-transform': 'translateX(10%)',
                        '-moz-transform': 'translateX(10%)'
                    }); 
                        
                        /*$('#car-blue-gadget').css({
                        '-webkit-transform': 'translateX(20%)',
                        '-ms-transform': 'translateX(20%)',
                        '-moz-transform': 'translateX(20%)'
                    });*/
                        
                        $('#car-blue').bind(transition, function() {
                            $('#car-blue').unbind(transition);
                                endGlobalTransition();
								
                            });
                        
                        /*$('#car-blue-gadget').bind(transition, function() {
                            $('#car-blue-gadget').unbind(transition);
                                endGlobalTransition();
								
                            });*/
                        
                        });
                    });
                });
            });
},3000);
	clearInterval(eks);
}

function girlAnimation() {
    
    setTimeout(function(){
            $("#section-1-3-text-1-1").show();
            setTimeout(function(){
                $("#section-1-3-text-1-2").show();
            },1000)
        },100);
  
   setTimeout(function(){
        scaleRayBest(function() {
        $('#section-' + lastSection).css('opacity', '0');
        $('#section-' + lastSection).bind(transition, function() {
            $(this).unbind(transition);
            $('#girl-1').hide();
            $('#girl-2').show();
            $("#section-1-3-text-1-1").hide();
            $("#section-1-3-text-1-2").hide();
            
            setTimeout(function(){
                $("#section-1-3-text-2-1").show();
            setTimeout(function(){
                $("#section-1-3-text-2-2").show();
            },900)
        },3100);

            hideRayBest(function() {
                $('#section-' + lastSection).css('opacity', '1');
                $('#section-' + lastSection).bind(transition, function() {
                    $(this).unbind(transition);
                    setTimeout(function() {
                        $('#text-container').css('opacity', '0');
                        $('#text-container').bind(transition, function() {
                            $(this).unbind(transition);
                            $("#section-1-3-text-2-1").hide();
                            $("#section-1-3-text-2-2").hide();
                            
                            $('#girl-2-img').css({
                                '-webkit-transform': 'translateX(-90px)',
                                '-ms-transform': 'translateX(-90px)',
                                '-moz-transform': 'translateX(-90px)'
                            });

                            $('#text-container').css('opacity', '1');
                            $('#text-container').bind(transition, function() {
                                $(this).unbind(transition);
                                setTimeout(function() {
   
                                    $('#gadget-1').css('opacity', '0');
                                    $('#gadget-1').bind(transition, function() {
                                        $(this).unbind(transition);
                                        $('#gadget-2').css('opacity', '1');
                                        $('#gadget-2').bind(transition, function() {
                                            $(this).unbind(transition);
                                        });
                                    });
                                    
                                    $('#text-container').css('opacity', '0');
                                    $('#text-container').bind(transition, function() {
                                        $(this).unbind(transition);
                                       // $('#section-1-3-text-3-1').hide();
                                        //$('#section-1-3-text-3-2').hide();
                                        
                                        
                                        setTimeout(function(){
                                            $('#section-1-3-text-4-1').show();
                                        setTimeout(function(){
                                            $('#section-1-3-text-4-2').show();
                                        },1000)
                                    },800);

                                        $('#text-container').css('opacity', '1');
                                        $('#text-container').bind(transition, function() {
                                            $(this).unbind(transition);
                                            endGlobalTransition();
                                        });
                                    });
                                }, 100);
                            });
                        });
                    }, 100);
                });
            });
        });
    });
   },2000);
}

function showSubSection(role) {
    lastSection = role;
    $('#container-menu, #section-2').css('opacity', '0');
    $('#container-menu').bind(transition, function() {
        $(this).unbind(transition);
        setTimeout(function() {
            resetScaleRayBest();
            $('#container-menu').fadeOut(0, function() {
                $('#section-1').hide();
                $('#section-2').hide();
                $('#section-' + role).fadeIn(0, function() {
                    $('#section-' + role).css('opacity', '1');
                    $('#section-' + role).bind(transition, function() {
                        $(this).unbind(transition);
                        $('#' + lastSection).css('opacity', '0');
                        switch (role) {
                            case '1-1':
                                carAnimation();
                                break;
                            case '1-2':
                                youtubeAnimation();
                                break;
                            case '1-3':
                                girlAnimation();
                                break;
                        }
                    });
                });
            });
        }, 0);
    });
}

function startAudio(icon) {
    audios[icon].play();
}

function createListeners() {
    window.onorientationchange = updateOrientation;
    $('.panel').on('click', function() {
        if (parseInt($(this).css('opacity')) !== 0) {
            var role = $(this).attr('id');
            if (!ismobile) {
                if ($('.flip').length > 0) {
                    showSubSection(role);
                }
            } else {
                if ($(this).hasClass('hover')) {
                    showSubSection(role);
                } else {
                    if ($('.flip').length > 0) {
                        $('.panel').removeClass('hover');
                        $(this).addClass('hover');
                        var icon = $(this).attr('data-audio');
                        startAudio(icon);
                    }
                }
            }
        }
    });
    $('.icons').on('click', function() {
        var id = $(this).attr('id').split('_')[1];
        console.log(id);
        showSubSection(id);
    });

    $('.panel .back').bind(transition, function() {
        if ($('.flip').length > 0) {
            var angle = getRotationDegrees($(this));
            if (angle === 0) {
                var icon = $(this).parent().attr('data-audio');
                startAudio(icon);
            }
        }
    });
}

function createAudios() {
    audios.icon1 = new Sound({src: 'audio/Coverage.wav'});
    audios.icon2 = new Sound({src: 'audio/Unlimited_Data.wav'});
    audios.icon3 = new Sound({src: 'audio/Customer_Service.wav'});
}

window.onload = function() {
    $(".ocultar").hide();
    $('.coin').fadeOut();
    window.scrollTo(0, 1);
    transition = transitionEvent();
    animation = animationEvent();
    updateOrientation();
    createListeners();
    createAudios();
};