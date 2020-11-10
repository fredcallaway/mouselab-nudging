
async function initializeExperiment() {
  LOG_DEBUG('initializeExperiment');
  debug = false;

  const nudge_type = Math.random()<0.5 ? 'default' : 'supersize';


  /* -- -- -- -- -- -- -- --- -- -- -- -- -- - */
  /* -- -- -- -- -- -- -- --- -- -- -- -- -- - */
  /* -- -- -- -- Instruction pages -- -- -- -- - */
  /* -- -- -- -- -- -- -- --- -- -- -- -- -- - */
  /* -- -- -- -- -- -- -- --- -- -- -- -- -- - */

  const instructionstext1 = 
      '<p>Welcome! In this HIT you will play a series of 20 choice games. '+
          'In each game you will choose one of six options. After you have made your choice, '+
          'the option you choose will pay a number of small prizes. In the example below, '+
          'each option will pay some number of A prizes (worth 1 point each), B prizes (worth 5 points each), and C '+
          'prizes (worth 4 points each).</p> &nbsp;' +
          '<img src="static/images/screen1.png" style="width:700px;">&nbsp;'
              
  const instructionstext2 = 
          '<p>The number of prize of each type you get depends on which option you choose. '+
              'To see how many prizes an options pays, you will have to click on the correpsonding box between 1 and 4 times.' +
              'You may reveal as many or as few of these numbers as you wish. This may help you decide which choice to make. '+
              'At the end of the experiment, the points you earned are paid out as a bonus with <b>10 points equal to $0.01.</b></p>&nbsp;' +
              '<img src="static/images/screen1.png" style="width:700px;">&nbsp;'

  const instructionstext3 = 
      '<p>Different boxes require more different numbers to uncover. The darker the shade of red over a box, the more clicks needed to uncover it.</p>&nbsp;' +
          '<img src="static/images/screen1.png" style="width:700px;">&nbsp;'

  const instructionstext4 = 
      '<p>For example, clicking once on the first box under Option 3 reveals that if Option 3 is chosen, it will pay '+
          '5 A prizes. Each one of these A prizes pays off 1 point each. '+
          'Note that the number of A prizes each option pays off is different.</p>&nbsp;' +
          '<img src="static/images/screen2.png" style="width:700px;">&nbsp;'

  const instructionstext5 = 
      '<p> Similarly, clicking four times on the second box under Option 2 reveals that if Option 2 is chosen,'+
      ' it will pay off 7 B prizes (each worth 5 points).</p>&nbsp;' +
          '<img src="static/images/screen3.png" style="width:700px;">&nbsp;'

  const instructionstext6 = 
      "<p>When you have finished revealing boxes, you can select an option by clicking on its gray option box. "+
          "In this pretend example, let's imagine that you select Option 2. "+
          'You would do this by clicking on the "Option 2" box. '+
          'In this case, you would win 4 A prizes (worth 1 point each), 7 B prizes (worth 5 points each), and 5 C prizes '+
          '(worth 4 points each), for a total of 59 points ($0.059). Note that you do not have to reveal any values to choose an option.</p>&nbsp;' +
          '<img src="static/images/screen4.png" style="width:700px;">&nbsp;'

  const instructionstext7 = 
      "<p>Let's see the values that would have been revealed if you had clicked on all of the boxes in a different game.</p>&nbsp;"+
          '<img src="static/images/screen5.png" style="width:700px;">&nbsp;'

  const instructionstext8 = 
      '<p>On average, an option pays <b>5 prizes</b> of each prize type, although the actual prize number can be anywhere from 0 to 10.</p>&nbsp;'+
          '<img src="static/images/screen6.png" style="width:700px;">&nbsp;'

  const instructionstext9 = 
      "<p>After choosing an option, you move on to a new game. With each new game, the number of prizes each option pays will change. "+
          'The value of each prize will also change.</p>' +
      '<p>You will win real money for your choices. You can observe your '+
      'current total earnings at any time in the upper right hand side of the screen. '+
      'At the end of the experiment, your earnings will be rounded to the nearest cent and paid as a bonus.</p>&nbsp;'

  const instructions_default = 
      "<p>On certain problems, you will have the option of choosing a recommended option before revealing any prize values. "+
      "<p>The recommended basket is the highest-paying basket if the prizes pay equal numbers of points</b>. " +
      "Similarly, the more varied the points are, the less good the recommended option will tend to be.  </p>&nbsp;"

  const instructions_supersize = 
      "<p>On certain problems, you will have the option of choosing a recommended option before revealing any prize values. "+
      "<p>On certain problems, you may receive this recommendation after choosing an option.</p>"+
      "<p>The recommended option is <b>optimal if the prizes pay equal numbers of points</b>. " +
      "Similarly, the more varied the points are, the less good the recommended option will tend to be.  </p>&nbsp;"

  const instructionstext10 = "Hello!"

  const instructions_array = debug ? [] : [instructionstext1, instructionstext2, instructionstext3,instructionstext4,instructionstext5,instructionstext6,instructionstext7,instructionstext8,instructionstext9,instructionstext10];

  const instructions = {
      type: "instructions",
      pages: instructions_array,
      show_clickable_nav: true,
      button_label_next: "Continue",
      allow_keys: false,
      on_start: function(data){
          jsPsych.top_obj.show_instructions();
      }
  };

  /* -- -- -- -- -- -- -- --- -- -- -- -- -- - */
  /* -- -- -- -- -- -- -- --- -- -- -- -- -- - */
  /* -- -- -- -- Attention check or quiz -- -- -- -- - */
  /* -- -- -- -- -- -- -- --- -- -- -- -- -- - */
  /* -- -- -- -- -- -- -- --- -- -- -- -- -- - */

  const attentionCheck = {
      type: 'html-button-response',
      data: {UselessField: true},
      stimulus:
          "<p>Participants who are paying attention, please select the button below with the second letter "+
              "of the English alphabet.</p> &nbsp",
      choices: ['  A  ', '  B  ', '  C  '],
      on_start: function(trial){
          var newArrangement = ['  A  ', '  B  ', '  C  ']
          trial.choices = newArrangement;
          correctResponse = newArrangement.indexOf('  B  ');
          trial.data.correctChoice = correctResponse;
      },
      on_finish: function(data){
          if (data.button_pressed != String(data.correctChoice)){
              data.isCorrect = false;
          } else {
              data.isCorrect = true
          }
      }
  }

  /* -- -- -- -- -- -- -- --- -- -- -- -- -- - */
  /* -- -- -- -- Test / practice trial information -- -- -- -- - */
  /* -- -- -- -- -- -- -- --- -- -- -- -- -- - */
  /* -- -- -- -- -- -- -- --- -- -- -- -- -- - */

  const practice_instructions = {
      type: 'html-button-response',
      stimulus:
              "<p>You will first complete 2 practice games. Earnings from these games will not be added to your final pay.</p> &nbsp;",
      choices: [' Continue ']
  }


  const test_instructions = {
      type: 'html-button-response',
      stimulus:
              "<p>You will now complete 20 test games. Earnings from these games will be added to your final pay.</p> &nbsp;",
      choices: [' Continue ']
  }


  const final_screen = {
      type: 'survey-text',
      button_label: 'Finish Experiment',
      questions: [{prompt: "<p class = 'computer-number'> The experiment is now over. Your total pay is <span>$"+(jsPsych.top_obj.total_earnings).toFixed(2)+".</span> After "+
      "completing the optional response below, please press the button to finish the experiment" +
      "and receive your pay.</p>"+
      "Was there anything in the experiment which was not clear?",rows:15,columns:85}],
      data: {isProblem: false},
      on_start: function(trial){
          jsPsych.top_obj.finish_experiment();
          total_earned = jsPsych.data.get().filter({trial_type: 'implicit-mouselab'}).filter({is_practice: false}).select('total_earnings').sum() + 0.65;
          if (round2(total_earned) != round2(jsPsych.top_obj.total_earnings) || total_earned>5){
              let problemPrompt =  "<p class = 'computer-number'> There is a problem calculating your pay. Please contact the researcher "+
                  "at <span>mdhardy@princeton.edu</span> to resolve this issue. If you have any other feedback you'd like "+
                  "to leave, please do so below, and then click the button to finish the experiment.";
              trial.questions = [{prompt: problemPrompt,rows:15,columns:85}]
              trial.data.isProblem = true;
          } else{
              let problemPrompt =  "<p class = 'computer-number'> The experiment is now over. Your total pay is <span>$"+(round2(jsPsych.top_obj.total_earnings).toFixed(2))+".</span> After "+
              "completing the optional response below, please press the button to finish the experiment " +
              "and receive your pay.</p>"+
              "Was there anything in the experiment which was not clear?";
              trial.questions = [{prompt: problemPrompt,rows:15,columns:85}]
              trial.data.isProblem = true;
          }
      }
  }


  const conditional_timeline = [];
  conditional_timeline.push(practice_instructions)
  // practice_instructions
  for (let i=0;i<2;i++){
      // let curr_info = trial_info[i]
      let curr_trial = {
          type: 'implicit-mouselab',
          trial_num:i+1,
          is_practice:true,
          on_start:function(){
              jsPsych.top_obj.update_practice_num();
          }
      }
      conditional_timeline.push(curr_trial)
  }
  conditional_timeline.push(test_instructions)
  for (let i=2;i<22;i++){
      let curr_trial = {
          type: 'implicit-mouselab',
          trial_num:i+3,
          is_practice:false,
          on_start: function(){
              jsPsych.top_obj.update_test_num();
          }
      }
      conditional_timeline.push(curr_trial)
  }
  const experiment_trials = {
      timeline: conditional_timeline,
      conditional_function: () => jsPsych.data.get().last(1).values()[0].isCorrect
  }


  const timeline = [];
  timeline.push(instructions)
  timeline.push(attentionCheck)
  timeline.push(experiment_trials)
  timeline.push(final_screen)

  return startExperiment({
    timeline,
    show_progress_bar: true,
    exclusions: {
      min_width: 800,
      min_height: 600
    },
  });
};


