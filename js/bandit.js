jsPsych.plugins['bandit'] = (function() {
   
	var plugin = {};

    // ask jsPsych to preload the images
    jsPsych.pluginAPI.registerPreload('moat', 'face_stimuli', 'image');
    jsPsych.pluginAPI.registerPreload('moat', 'place_stimuli', 'image');
    jsPsych.pluginAPI.registerPreload('moat', 'infosource_stimuli', 'image');
    jsPsych.pluginAPI.registerPreload('moat', 'bugmush_images', 'image');
    jsPsych.pluginAPI.registerPreload('moat', 'feedback_images', 'image');
	var AlfaChooseCounter = 0, BetaChooseCounter=0;
	var forcedShowed = false, enter = false;
	
    plugin.info = {
        name: 'bandit',
        parameters: {
            face_stimuli: {
                type:jsPsych.plugins.parameterType.STRING, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
                default: null,
                description: 'The array of paths to face stimuli'
            },
            place_stimuli: {
                type:jsPsych.plugins.parameterType.STRING, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
                default: null,
                description: 'The array of paths to place stimuli'
            },
            info_stimuli: {
                type:jsPsych.plugins.parameterType.STRING, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
                default: null,
                description: 'The array of paths to infosource stimuli'
            },
            bug_stimuli: {
                type:jsPsych.plugins.parameterType.STRING, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
                default: null,
                description: 'The array of paths to bugmush stimuli'
            },
            feedback_images: {
                type:jsPsych.plugins.parameterType.STRING, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
                default: null,
                description: 'The array of paths to feedback images'
            },
            image_allocation: {
                type:jsPsych.plugins.parameterType.INT, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
                default: [0, 1, 2],
                description: 'The mapping to subject-specific images (allows randomisation of visual stimuli)'
            },
            canvas_dimensions: {
                type:jsPsych.plugins.parameterType.INT, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
                default: [1000, 550],
                description: 'The dimensions [width, height] of the html canvas on which things are drawn'
            },
            background_colour: {
                type: jsPsych.plugins.parameterType.STRING,
                default: '#878787',
                description: 'The colour of the background'
            },
            stimulus_offset: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Stimulus offset',
                default: [270, 0],
                description: 'The offset [horizontal, vertica] of the centre of each stimulus from the centre of the canvas in pixels'
            },
            stimulus_dimensions: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Stimulus dimensions',
                default: [250, 250],
                description: 'Stimulus dimensions in pixels [width, height]'
            },
            left_key: {
                type: jsPsych.plugins.parameterType.KEYCODE,
                pretty_name: 'Left key',
                default: 'arrowleft',
                description: 'The key to be pressed to select the left planet'
            },
            right_key: {
                type: jsPsych.plugins.parameterType.KEYCODE,
                pretty_name: 'Right key',
                default: 'arrowright',
                description: 'The key to be pressed to select the right planet'
            },
            choice_listen_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Choice window duration',
                default: 100000,
                description: 'How long to wait for a response (in milliseconds).'
            },
            choice_display_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Choice display duration',
                default: 1500,
                description: 'How long to display the response (in milliseconds).'
            },
            feedback_display_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Feedback display duration',
                default: 3000,
                description: 'How long to display the feedback (in milliseconds).'
            },
            iti_duration: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Duration of inter-trial interval',
                default: 1500,
                description: 'How long to display a blank screen between trials (in milliseconds).'
            },
            selection_pen_width: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Width of selection box',
                default: 15,
                description: 'Thickness (in pixels) of the selection box'
            },
            selection_colour: {
                type: jsPsych.plugins.parameterType.STRING,
                default: 'blue', // #FFFFFF is white
                description: 'The colour of the selection box'
            },
            feedback_offset: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Feedback offset',
                default: [0, 120],//[270, -200],
                description: 'The offset [horizontal, vertica] of the centre of the feedback from the centre of the canvas in pixels'
            },
            feedback_dimensions: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Feedback dimensions',
                default: [120, 120],
                description: 'Feedback image dimensions in pixels [width, height]'
            },
            reward_colour: {
                type: jsPsych.plugins.parameterType.STRING,
                default: '#00CA33', // #00CA33 is green
                description: 'The colour of the selection box during reward feedback'
            },
            non_reward_colour: {
                type: jsPsych.plugins.parameterType.STRING,
                default: '#FF0000', // #FF0000 is red
                description: 'The colour of the selection box during non-reward feedback'
            },
            //
            QuestioniDsplayStatus:{
                type:jsPsych.plugins.parameterType.INT,
                default :0,//0 or 1
                description: 'Show question at the bottom or top'
            }
        }
    }

    plugin.trial = function(display_element, trial) {
    
        // add a canvas to the HTML_STRING, store its context, and draw a blank background
        var new_html = '<canvas id="trial_canvas" width="'+trial.canvas_dimensions[0]+'" height="'+trial.canvas_dimensions[1]+'"></canvas>';
		display_element.innerHTML= new_html;
        var ctx = document.getElementById('trial_canvas').getContext('2d');
        DrawBackground(); // draw the background of the canvas
       
        // set up a container for key responses
        var response = {
            rt: null,
            key: null,
            key_char: null,
            choice: null
        };

        // set up a container for display configuration
        var display = {
            left_stimulus: null,
            right_stimulus: null,
            left_image_number: null,
            right_image_number: null,
            left_box: null,
            right_box: null,

            left_info_stimulus: null,
            right_info_stimulus: null,
            left_info_image_number: null,
            right_info_image_number: null,
            left_info_box: null,
            right_info_box: null,

            left_bug_stimulus: null,
            right_bug_stimulus: null,
            left_bug_image_number: null,
            right_bug_image_number: null,
            left_bug_box: null,
            right_bug_box: null
        }
    
        ///// TRIAL LOOP /////

        trial.QuestioniDsplayStatus=  Math.floor(Math.random() *2);
       
        switch (trial.choice_type) {
            case "abforced":{
                
				console.log(trial.first);
				console.log(trial.choice_type);
				console.log(trial.selected);
				console.log(trial.left_bug_img_val);
				console.log(trial.right_bug_img_val);
				console.log(trial.result);
				

				if (trial.first == "forced") {
					display.left_info_stimulus  = [trial.left_info_img];
					display.right_info_stimulus = [trial.right_info_img];	
					display.left_bug_stimulus   = null;
					display.right_bug_stimulus  = null;
					ctx.font = "28px Arial";
					ctx.fillStyle = "white";
					ctx.textAlign = "center";
					var press_enter_text = "Automatic choice - Please press Enter to continue.";
					ctx.fillText(press_enter_text, trial.canvas_dimensions[0]/2, 21* ctx.measureText('M').width);
				}
				else {
					display.left_info_stimulus  = null;
					display.right_info_stimulus = null;
					display.left_bug_stimulus   = [trial.left_bug_img];
					display.right_bug_stimulus  = [trial.right_bug_img];
				}
				

            } break;
			
			case "lmforced":{
                
				console.log(trial.first);
				console.log(trial.choice_type);
				console.log(trial.left_info_img);
				console.log(trial.right_info_img);
				console.log(trial.left_bug_img);
				console.log(trial.right_bug_img);
				console.log(trial.left_bug_img_val);
				console.log(trial.right_bug_img_val);
				console.log(trial.result);
				
				if (trial.first == "forced") {
					display.left_info_stimulus  = [trial.left_bug_img];
					display.right_info_stimulus = [trial.right_bug_img];	
					display.left_bug_stimulus   = null;
					display.right_bug_stimulus  = null;
					ctx.font = "28px Arial";
					ctx.fillStyle = "white";
					ctx.textAlign = "center";
					var press_enter_text = "Automatic choice - Please press Enter to continue.";
					ctx.fillText(press_enter_text, trial.canvas_dimensions[0]/2, 21* ctx.measureText('M').width);
				}
				else {
					display.left_info_stimulus  = null;
					display.right_info_stimulus = null;
					display.left_bug_stimulus   = [trial.left_info_img];
					display.right_bug_stimulus  = [trial.right_info_img];
				}

            } break;
        }

        DrawScreen();

        // start the response listener
        /*var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: AfterResponse,
            valid_responses: [trial.left_key, trial.right_key],
            rt_method: 'performance',
            persist: false,
            allow_held_key: false
        });*/
		
		document.onkeydown = checkKey;
		function checkKey(e) {
			e = e || window.event;	
			if (e.keyCode == '37') { // left arrow
				if (trial.first == "forced" && enter) {
					response.chosen_image = display.left_image_number;
					response.ur_chosen_image = trial.left_image_number;
					if (display.right_box != "selected") {
						display.left_box = "selected";
						response.choice = 'left';
						_DrawSelectionBox(-trial.stimulus_offset[0], trial.stimulus_offset[1], 'blue');
					}
					DrawScreen(ctx);
					
					const myTimeout = setTimeout(function() {
						enter = false;
						DisplayFeedback();
					}, 2000);
				}
				else if (trial.first == "free" && !forcedShowed) {
					response.chosen_image = display.left_image_number;
					response.ur_chosen_image = trial.left_image_number;
					if (display.right_box != "selected") {
						display.left_box = "selected";
						response.choice = 'left';
						_DrawSelectionBox(-trial.stimulus_offset[0], trial.stimulus_offset[1], 'blue');
					}
					DrawScreen(ctx);
					
					const myTimeout = setTimeout(function() {
						ctx.font = "28px Arial";
						ctx.fillStyle = "white";
						ctx.textAlign = "center";
						var press_enter_text = "Automatic choice - Please press Enter to continue.";
						ctx.fillText(press_enter_text, trial.canvas_dimensions[0]/2, 21* ctx.measureText('M').width);
						_DrawSelectionBox(-trial.stimulus_offset[0], trial.stimulus_offset[1], trial.background_colour);
						if(trial.choice_type == "abforced"){
							display.left_info_stimulus  = [trial.left_info_img];
							display.right_info_stimulus = [trial.right_info_img];
							display.left_bug_stimulus   = null;
							display.right_bug_stimulus  = null;
						}
						else{
							display.left_info_stimulus  = [trial.left_bug_img];
							display.right_info_stimulus = [trial.right_bug_img];
							display.left_bug_stimulus   = null;
							display.right_bug_stimulus  = null;
						}

						DrawScreen(ctx);
						forcedShowed=true;
					}, 2000);
				}
			}
			else if (e.keyCode == '39') { // right arrow
				if (trial.first == "forced" && enter) {
					response.chosen_image = display.right_image_number;
					response.ur_chosen_image = trial.right_image_number;
					if(display.left_box != "selected") {
						display.right_box = "selected";
						response.choice = 'right';
						_DrawSelectionBox(trial.stimulus_offset[0], trial.stimulus_offset[1], 'blue');
					}
					DrawScreen(ctx);
					
					const myTimeout = setTimeout(function() {
						enter = false;
						DisplayFeedback();
					}, 2000);
				}
				else if (trial.first == "free" && !forcedShowed) {
					response.chosen_image = display.right_image_number;
					response.ur_chosen_image = trial.right_image_number;
					if(display.left_box != "selected") {
						display.right_box = "selected";
						response.choice = 'right';
						_DrawSelectionBox(trial.stimulus_offset[0], trial.stimulus_offset[1], 'blue');
					}

					DrawScreen(ctx);

					const myTimeout = setTimeout(function() {
						ctx.font = "28px Arial";
						ctx.fillStyle = "white";
						ctx.textAlign = "center";
						var press_enter_text = "Automatic choice - Please press Enter to continue.";
						ctx.fillText(press_enter_text, trial.canvas_dimensions[0]/2, 21* ctx.measureText('M').width);
						_DrawSelectionBox(trial.stimulus_offset[0], trial.stimulus_offset[1], trial.background_colour);
						if(trial.choice_type == "abforced"){
							display.left_info_stimulus  = [trial.left_info_img];
							display.right_info_stimulus = [trial.right_info_img];
							display.left_bug_stimulus   = null;
							display.right_bug_stimulus  = null;
						}
						else{
							display.left_info_stimulus  = [trial.left_bug_img];
							display.right_info_stimulus = [trial.right_bug_img];
							display.left_bug_stimulus   = null;
							display.right_bug_stimulus  = null;
						}
						
						DrawScreen(ctx);
						forcedShowed=true;
					}, 2000);
				}
			}
			else if (e.keyCode == '13') {
				if (trial.first == "forced" && !enter) {
					ctx.fillStyle = trial.background_colour;
					ctx.fillRect(0,450, ctx.measureText('Automatic choice - Please press Enter to continue.').width*2, 150);
					if(trial.choice_type == "abforced"){
						display.left_info_stimulus  = null;
						display.right_info_stimulus = null;
						display.left_bug_stimulus   = [trial.left_bug_img];
						display.right_bug_stimulus  = [trial.right_bug_img];
					}
					else{
						display.left_info_stimulus  = null;
						display.right_info_stimulus = null;
						display.left_bug_stimulus   = [trial.left_info_img];
						display.right_bug_stimulus  = [trial.right_info_img];
					}
					enter = true;
					DrawScreen(ctx);
				}
				else if (trial.first == "free" && forcedShowed){
					forcedShowed=false;
					ctx.fillStyle = trial.background_colour;
					ctx.fillRect(0,450, ctx.measureText('Automatic choice - Please press Enter to continue.').width*2, 150);
					DisplayFeedback();
				}
			}
		}

        // set a timeout function to end the trial after a given time if no response is recorded
        if (trial.choice_listen_duration !== null) {
			jsPsych.pluginAPI.setTimeout(function() {
				EndTrial();
            }, trial.choice_listen_duration);
        }
		//end if-loop

        ///// MAIN FUNCTIONS /////

        // function to draw background
        function DrawBackground(){
            // draw the background
            ctx.fillStyle = trial.background_colour;
            ctx.fillRect(0, 0, trial.canvas_dimensions[0], trial.canvas_dimensions[1]);

            // draw the progress text
            ctx.font = "28px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            var info_text = "Block " + counter.block + " of " + counter.n_blocks + ", Trial " + counter.trial + " of " + trial.n_trials;
            ctx.fillText(info_text, trial.canvas_dimensions[0]/2, 4* ctx.measureText('M').width/2);
			//var press_enter_text = "Automatic choice - Please press Enter to continue.";
            //ctx.fillText(press_enter_text, trial.canvas_dimensions[0]/2, 21* ctx.measureText('M').width);
			//ctx.fillStyle = trial.background_colour;
            //ctx.fillRect(0,450, ctx.measureText('Automatic choice - Please press Enter to continue.').width*2, 150);
        };
		
		// Alfa should return exact info at 70% of times (and Bate 30%)
		function WinAlfa(){
			if (AlfaChooseCounter==1) {
				return true;
			}
			if (AlfaChooseCounter==2) {
				return false;
			}
			if (AlfaChooseCounter==3) {
				return true;
			}
		}
		function WinBeta(){
			if (BetaChooseCounter==1) {
				return false;
			}
			if (BetaChooseCounter==2) {
				return true;
			}
			if (BetaChooseCounter==3) {
				return false;
			}
		}

        // function to draw the stimuli to screen flexibly
        function DrawScreen() {
			
            // if the left stimulus is selected, show the appropriate selection box
            //if (display.left_box == "selected") {
				//_DrawSelectionBox(-trial.stimulus_offset[0], trial.stimulus_offset[1], trial.selection_colour);
            //}
			if (display.left_box == "Win") {
				
				if (trial.choice_type == "abforced") {
					display.left_bug_stimulus=[trial.feedback_images[5]];
					display.right_bug_stimulus=null;
					display.left_info_stimulus=null;
					
					if (trial.left_info_img == trial.selected) {
						//display.right_info_stimulus=null;
						if (trial.result == "Wingame")
							display.right_info_stimulus=[trial.feedback_images[6]];
							//display.left_info_stimulus=[trial.feedback_images[6]];
						else
							display.right_info_stimulus=[trial.feedback_images[4]];
							//display.left_info_stimulus=[trial.feedback_images[4]];
					}
					else {
						if (trial.result == "Wingame")
							display.right_info_stimulus=[trial.feedback_images[6]];
						else
							display.right_info_stimulus=[trial.feedback_images[4]];
					}
				}
				else {
					display.left_bug_stimulus=[trial.feedback_images[6]];
					display.right_bug_stimulus=null;
					display.left_info_stimulus=null;
					
					if (trial.left_info_img == './img/A.jpg') {
						AlfaChooseCounter += 1;
						if (trial.left_bug_img == trial.selected) {
							//display.right_info_stimulus=null;
							if (WinAlfa())
								display.right_info_stimulus=[trial.feedback_images[5]];
								//display.left_info_stimulus=[trial.feedback_images[5]];
							else
								display.right_info_stimulus=[trial.feedback_images[3]];
								//display.left_info_stimulus=[trial.feedback_images[3]];
						}
						else {
							display.left_info_stimulus=null;
							if (WinAlfa())
								display.right_info_stimulus=[trial.feedback_images[5]];
							else
								display.right_info_stimulus=[trial.feedback_images[3]];
						}
					}
					else {
						BetaChooseCounter +=1;
						if (trial.left_bug_img == trial.selected) {
							if (WinBeta())
								display.right_info_stimulus=[trial.feedback_images[5]];
							else
								display.right_info_stimulus=[trial.feedback_images[3]];
						}
						else {
							if (WinBeta())
								display.right_info_stimulus=[trial.feedback_images[5]];
							else
								display.right_info_stimulus=[trial.feedback_images[3]];
						}
					}
				}
				
                _DrawSelectionBox(-trial.stimulus_offset[0], trial.stimulus_offset[1], trial.reward_colour);
            }
			else if (display.left_box == "Loss"){
				
				if (trial.choice_type == "abforced") {
					display.left_bug_stimulus=[trial.feedback_images[3]];
					display.right_bug_stimulus=null;  
					display.left_info_stimulus=null;
					
					if (trial.left_info_img == trial.selected) {
						if (trial.result == "Wingame")
							display.right_info_stimulus=[trial.feedback_images[4]];
						else
							display.right_info_stimulus=[trial.feedback_images[6]];
					}
					else {
						if (trial.result == "Wingame")
							display.right_info_stimulus=[trial.feedback_images[4]];
						else
							display.right_info_stimulus=[trial.feedback_images[6]];
					}
				}
				else {
					display.left_bug_stimulus=[trial.feedback_images[4]];
					display.right_bug_stimulus=null;
					display.left_info_stimulus=null;
					
					if (trial.left_info_img == './img/A.jpg') {
						AlfaChooseCounter += 1;
						if (trial.left_bug_img == trial.selected) {
							if (WinAlfa())
								display.right_info_stimulus=[trial.feedback_images[3]];
							else
								display.right_info_stimulus=[trial.feedback_images[5]];
						}
						else {
							if (WinAlfa())
								display.right_info_stimulus=[trial.feedback_images[3]];
							else
								display.right_info_stimulus=[trial.feedback_images[5]];
						}
					}
					else {
						BetaChooseCounter +=1;
						if (trial.left_bug_img == trial.selected) {
							if (WinBeta())
								display.right_info_stimulus=[trial.feedback_images[3]];
							else
								display.right_info_stimulus=[trial.feedback_images[5]];
						}
						else {
							if (WinBeta())
								display.right_info_stimulus=[trial.feedback_images[3]];
							else
								display.right_info_stimulus=[trial.feedback_images[5]];
						}
					}
				}
                _DrawSelectionBox(-trial.stimulus_offset[0], trial.stimulus_offset[1], trial.non_reward_colour);
            }

            // if the right stimulus is selected, show the appropriate selection box
            //if (display.right_box == "selected") {
				//_DrawSelectionBox(trial.stimulus_offset[0], trial.stimulus_offset[1], trial.selection_colour);
            //}
			if (display.right_box == "Win") {
				
				if (trial.choice_type == "abforced") {
					display.right_bug_stimulus=[trial.feedback_images[5]];
					display.left_bug_stimulus=null;
					display.right_info_stimulus=null;
					
					if (trial.right_info_img == trial.selected) {
						if (trial.result == "Wingame")
							display.left_info_stimulus=[trial.feedback_images[6]];
						else
							display.left_info_stimulus=[trial.feedback_images[4]];
					}
					else {
						if (trial.result == "Wingame")
							display.left_info_stimulus=[trial.feedback_images[6]];
						else
							display.left_info_stimulus=[trial.feedback_images[4]];
					}
				}
				else {
					display.right_bug_stimulus=[trial.feedback_images[6]];
					display.left_bug_stimulus=null;
					display.right_info_stimulus=null;
					
					if (trial.right_info_img == './img/A.jpg') {
						AlfaChooseCounter += 1;
						if (trial.left_bug_img == trial.selected) {
							if (WinAlfa())
								display.left_info_stimulus=[trial.feedback_images[5]];
							else
								display.left_info_stimulus=[trial.feedback_images[3]];
						}
						else {
							if (WinAlfa())
								display.left_info_stimulus=[trial.feedback_images[5]];
							else
								display.left_info_stimulus=[trial.feedback_images[3]];
						}
					}
					else {
						BetaChooseCounter +=1;
						if (trial.left_bug_img == trial.selected) {
							if (WinBeta())
								display.left_info_stimulus=[trial.feedback_images[5]];
							else
								display.left_info_stimulus=[trial.feedback_images[3]];
						}
						else {
							if (WinBeta())
								display.left_info_stimulus=[trial.feedback_images[5]];
							else
								display.left_info_stimulus=[trial.feedback_images[3]];
						}
					}
				}
                _DrawSelectionBox(trial.stimulus_offset[0], trial.stimulus_offset[1], trial.reward_colour);
            }
			else if (display.right_box == "Loss") {
                
				if (trial.choice_type == "abforced") {
					display.right_bug_stimulus=[trial.feedback_images[3]];
					display.left_bug_stimulus=null;
					display.right_info_stimulus=null;
					
					if (trial.right_info_img == trial.selected) {
						if (trial.result == "Wingame")
							display.left_info_stimulus=[trial.feedback_images[4]];
						else
							display.left_info_stimulus=[trial.feedback_images[6]];
					}
					else {
						if (trial.result == "Wingame")
							display.left_info_stimulus=[trial.feedback_images[4]];
						else
							display.left_info_stimulus=[trial.feedback_images[6]];
					}
				}
				else {
					display.right_bug_stimulus=[trial.feedback_images[4]];
					display.left_bug_stimulus=null;
					display.right_info_stimulus=null;
					
					if (trial.right_info_img == './img/A.jpg') {
						AlfaChooseCounter += 1;
						if (trial.left_bug_img == trial.selected) {
							if (WinAlfa())
								display.left_info_stimulus=[trial.feedback_images[3]];
							else
								display.left_info_stimulus=[trial.feedback_images[5]];
						}
						else {
							if (WinAlfa())
								display.left_info_stimulus=[trial.feedback_images[3]];
							else
								display.left_info_stimulus=[trial.feedback_images[5]];
						}
					}
					else {
						BetaChooseCounter +=1;
						if (trial.left_bug_img == trial.selected) {
							if (WinBeta())
								display.left_info_stimulus=[trial.feedback_images[3]];
							else
								display.left_info_stimulus=[trial.feedback_images[5]];
						}
						else {
							if (WinBeta())
								display.left_info_stimulus=[trial.feedback_images[3]];
							else
								display.left_info_stimulus=[trial.feedback_images[5]];
						}
					}
				}
                _DrawSelectionBox(trial.stimulus_offset[0], trial.stimulus_offset[1], trial.non_reward_colour);
            }
          
            // draw the left bug stimulus
			if (display.left_bug_stimulus !== null){
				_DrawStimulus(display.left_bug_stimulus, [-trial.stimulus_offset[0], trial.stimulus_offset[1]]);
            }
			else{
                _DrawBlankStimulus([-trial.stimulus_offset[0], trial.stimulus_offset[1]]);
            }
           
            // draw the right bug stimulus
            if (display.right_bug_stimulus !== null){
                _DrawStimulus(display.right_bug_stimulus, [trial.stimulus_offset[0], trial.stimulus_offset[1]]);
            } else {
                _DrawBlankStimulus([trial.stimulus_offset[0], trial.stimulus_offset[1]]);
            }
          
            // draw the left info stimulus
            if (display.left_info_stimulus !== null){
                _DrawStimulus(display.left_info_stimulus, [-trial.stimulus_offset[0], trial.stimulus_offset[1]]);
            } else {
                _DrawBlankStimulus([-trial.stimulus_offset[0], trial.stimulus_offset[1]]);
            }
            
            // draw the right info stimulus
            if (display.right_info_stimulus !== null){
                _DrawStimulus(display.right_info_stimulus, [trial.stimulus_offset[0], trial.stimulus_offset[1]]);
            } else{
                _DrawBlankStimulus([trial.stimulus_offset[0], trial.stimulus_offset[1]]);
            }
         
        }; // end DrawScreen function

        // function to handle responses by the subject
        function AfterResponse(info) {

            // clear keyboard listener
            jsPsych.pluginAPI.cancelAllKeyboardResponses();

            // kill any remaining setTimeout handlers
            jsPsych.pluginAPI.clearAllTimeouts();

            // only record the first response
            if (response.key == null) {
                response = info;
            }

            // assign response variables
            if (jsPsych.pluginAPI.compareKeys(trial.left_key, response.key)){
                response.choice = 'left';
                response.chosen_image = display.left_image_number;
                response.ur_chosen_image = trial.left_image_number;
                display.left_box = "selected";
            } else if (jsPsych.pluginAPI.compareKeys(trial.right_key, response.key)){
                response.choice = 'right';
                response.chosen_image = display.right_image_number;
                response.ur_chosen_image = trial.right_image_number;
                display.right_box = "selected";
            }

            // update the screen with the pressed key
            DrawScreen(ctx);

            // set a timeout to display the feedback after a given delay
            //jsPsych.pluginAPI.setTimeout(function() {
                //DisplayFeedback();
            //}, trial.choice_display_duration);

        }; // end AfterResponse

		function DisplayFeedback(){
			
			if (trial.choice_type == "abforced") {
				var left_image_number = null;
				var right_image_number = null;
			   
				left_image_number = trial.left_bug_image_number;
				right_image_number = trial.right_bug_image_number;
				
				if (trial.left_bug_image_type !== null) {
					left_image_number = trial.image_allocation.findIndex(function(element, index, arr){return element == this}, display.left_bug_image_number);
					if (response.choice == "left") {
						response.chosen_image = display.left_bug_image_number
						response.ur_chosen_image = left_image_number
					}
				}
				else if (trial.right_bug_image_type !== null) {
					right_image_number = trial.image_allocation.findIndex(function(element, index, arr){return element == this}, display.right_bug_image_number);
					if (response.choice == "right") {
						response.chosen_image = display.right_bug_image_number
						response.ur_chosen_image = right_image_number
					}
				}

				// check recorded choice and display corresponding colour
				if (response.choice == "left"){

					if (trial.left_bug_img_val)
						response.feedback = 1;
					else
						response.feedback = 0;

					// set selection box colour
					if (response.feedback == 0){
						display.left_box = "Loss";
					} else if (response.feedback == 1){
						display.left_box = "Win";
					}
				}
				else if (response.choice == "right") {

					if (trial.right_bug_img_val)
						response.feedback = 1;
					else
						response.feedback = 0;

					// set selection box colour
					if (response.feedback == 0){
						display.right_box = "Loss";
					} else if (response.feedback == 1){
						display.right_box = "Win";
					}
				}
			}
			else {
				var left_image_number = null;
				var right_image_number = null;

				if (response.choice == "left") {
					response.chosen_image = trial.left_info_image_number;
					response.ur_chosen_image = trial.left_info_image_number;
				}
				if (response.choice == "right") {
					response.chosen_image = trial.right_info_image_number;
					response.ur_chosen_image = trial.right_info_image_number;
				}

				// check recorded choice and display corresponding colour
				if (response.choice == "left") {

					if (trial.left_bug_img_val)
						response.feedback = 1;
					else
						response.feedback = 0;

					// set selection box colour
					if (response.feedback == 0){
						display.left_box = "Loss";
					} else if (response.feedback == 1){
						display.left_box = "Win";
					}
				}
				else if (response.choice == "right") {

					if (trial.right_bug_img_val)
						response.feedback = 1;
					else
						response.feedback = 0;

					// set selection box colour
					if (response.feedback == 0){
						display.right_box = "Loss";
					} else if (response.feedback == 1){
						display.right_box = "Win";
					}
				}
			}
            
            // draw the updated stimuli to the screen
            DrawScreen(ctx);

            // set a timeout to end the trial after a given delay
            jsPsych.pluginAPI.setTimeout(function() {
                ITI();
            }, trial.feedback_display_duration);

        } // end DisplayFeedback

        function _DrawSelectionBox(stimulus_horiz_offset, stimulus_vert_offset, colour) {
            var selection_horiz_loc = (trial.canvas_dimensions[0]/2) + stimulus_horiz_offset  - (trial.stimulus_dimensions[0] / 2) - trial.selection_pen_width;
            var stim_vert_loc = (trial.canvas_dimensions[1]/2) + stimulus_vert_offset  - (trial.stimulus_dimensions[1] / 2) - trial.selection_pen_width; // specifies the y coordinate of the top left corner of the stimulus
            ctx.fillStyle = colour;
            ctx.fillRect(selection_horiz_loc, stim_vert_loc, trial.stimulus_dimensions[0] + (2 * trial.selection_pen_width), trial.stimulus_dimensions[1] + (2 * trial.selection_pen_width));
        }

        function _DrawStimulus(stimulus_array, stimulus_offset) {
            // array sanity check: only draw a stimulus array if (a) the array exists, and (b) the array has a length greater than 0
            if (Array.isArray(stimulus_array) && stimulus_array.length > 0) {
                var img = new Image(); // create new image element
                // specify that the image should be drawn once it is loaded
                img.onload = function(){_ImageOnload(img, trial.stimulus_dimensions, stimulus_offset)};
                // set the source path of the image; in JavaScript, this command also triggers the loading of the image
                img.src = stimulus_array[0];
            }
        }

        function _DrawBlankStimulus(stimulus_offset) {
            var stim_horiz_loc = (trial.canvas_dimensions[0]/2) + stimulus_offset[0]  - (trial.stimulus_dimensions[0] / 2); // specifies the x coordinate of the top left corner of the stimulus
            var stim_vert_loc = (trial.canvas_dimensions[1]/2) + stimulus_offset[1] - (trial.stimulus_dimensions[1] / 2); // specifies the y coordinate of the top left corner of the stimulus
            ctx.fillStyle = trial.background_colour;
            ctx.fillRect(stim_horiz_loc, stim_vert_loc, trial.stimulus_dimensions[0], trial.stimulus_dimensions[1]);
        }

        function _ImageOnload(im, image_dimensions, image_offset){
            var stim_horiz_loc = (trial.canvas_dimensions[0]/2) + image_offset[0]  - (image_dimensions[0] / 2); // specifies the x coordinate of the top left corner of the stimulus
            var stim_vert_loc = (trial.canvas_dimensions[1]/2) + image_offset[1] - (image_dimensions[1] / 2); // specifies the y coordinate of the top left corner of the stimulus
            ctx.drawImage(im, stim_horiz_loc, stim_vert_loc, image_dimensions[0], image_dimensions[1]);
        }

        // function to show an empty screen for the duration of the inter-trial interval
        function ITI() {
            DrawBackground(); // draw the background of the canvas
            jsPsych.pluginAPI.cancelAllKeyboardResponses(); // clear keyboard listener
            jsPsych.pluginAPI.clearAllTimeouts(); // kill any remaining setTimeout handlers
            // set a timeout to end the ITI after a given delay
            jsPsych.pluginAPI.setTimeout(function() {
                EndTrial();
            }, trial.iti_duration);
        };

        // function to end trial when it is time
        function EndTrial() {
			
            jsPsych.pluginAPI.cancelAllKeyboardResponses(); // clear keyboard listener
            jsPsych.pluginAPI.clearAllTimeouts(); // kill any remaining setTimeout handlers

            // gather the data to store for the trial
            var trial_data = {
                'trial_type': trial.choice_type,
                'left_image_number': display.left_image_number,
                'right_image_number': display.right_image_number,
                'left_image_type': trial.left_image_type,
                'right_image_type': trial.right_image_type,
                'ur_left_image': trial.image_allocation.findIndex(function(element, index, arr){return element == this}, display.left_image_number),
                'ur_right_image': trial.image_allocation.findIndex(function(element, index, arr){return element == this}, display.right_image_number),
                'chosen_image': response.chosen_image,
                'ur_chosen_image': response.ur_chosen_image,
                'rt': response.rt,
                'key_char': response.key_char,
                'choice': response.choice,
                'stimulus_array': [trial.left_image_number, trial.right_image_number],
                'feedback': response.feedback
            };

            counter.trial += 1; // increment the trial counter
            jsPsych.finishTrial(trial_data); // move on to the next trial
		};
    }
    return plugin;
})();