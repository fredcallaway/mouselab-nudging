jsPsych.plugins["implicit-mouselab"] = (function() {

    var plugin = {};
  
    plugin.info = {
      name: "implicit-mouselab",
      parameters: {
          trial_num: {
              type: jsPsych.plugins.parameterType.INT,
              default: undefined
          },
          is_practice: {
              type: jsPsych.plugins.parameterType.BOOL,
              default: undefined
          },
          trial_type:{
            type: jsPsych.plugins.parameterType.STRING,
            default: 'supersize'
          },
          default_type:{
            type: jsPsych.plugins.parameterType.STRING,
            default: 'na'
          },
          supersize_type:{
            type: jsPsych.plugins.parameterType.STRING,
            default: 'na'
          },
          num_baskets:{
            type: jsPsych.plugins.parameterType.INT,
            default: 6
          },
          num_prizes:{
            type: jsPsych.plugins.parameterType.INT,
            default: 3
          },
          cost_val:{
            type: jsPsych.plugins.parameterType.INT,
            default: 2
          }
      }
    }
  
    plugin.trial = function(display_element, trial) {
        function makeGaussianFunction(mean, stdev) {
            var y2;
            var use_last = false;
            return function() {
                var y1;
                if(use_last) {
                y1 = y2;
                use_last = false;
                }
                else {
                    var x1, x2, w;
                    do {
                        x1 = 2.0 * Math.random() - 1.0;
                        x2 = 2.0 * Math.random() - 1.0;
                        w  = x1 * x1 + x2 * x2;               
                    } while( w >= 1.0);
                    w = Math.sqrt((-2.0 * Math.log(w))/w);
                    y1 = x1 * w;
                    y2 = x2 * w;
                    use_last = true;
            }
        
            var retval = mean + stdev * y1;
            if(retval > 0) 
                return retval;
            return -retval;
            }
        }

        function findAll(){
            let sum_vec = [];
            for (let a=1;a<=8;a++){
            for (let b=1;b<=8;b++){
                for (let c=1;c<=8;c++){
                    if (a+b+c==10) sum_vec.push([a,b,c]);
                }
            }
            }
            return sum_vec
        }

        function getWeights(){
            const all_possibilities = findAll();
            const curr_weights = all_possibilities[Math.floor(Math.random()*all_possibilities.length)];
            return curr_weights
        }
    

      function setSplashPosition(type_string){
            $('#splash-wrapper').css('display','block');
            $(`#${type_string}-wrapper`).css('display','block');
            $('#splash-wrapper').css('visibility','hidden');
            $(`#${type_string}-wrapper`).css('visibility','hidden');
            const table_top = document.getElementById('implicit-table').getBoundingClientRect().top;
            const splash_height = parseFloat($('#splash').css('height'));
            const top = Math.max((table_top - (splash_height +15)),0);
            $('#splash').css('top',`${top}px`);
            $(`#splash-wrapper`).css('visibility','visible');
            $(`#${type_string}-wrapper`).css('visibility','visible');
      }
    

      function show_default(){
        setSplashPosition('default');
        $('#default-index-span').html(String(nudge_index+1));
        $(`#option-${nudge_index+1}`).css('background','#5f9e70');
        $('#default-yes').click(function(){
            $('#splash-wrapper').css('display','none');
            $('#default-wrapper').css('display','none');
            choose_option(nudge_index,true,false);
        });
        $('#default-no').click(function(){
            $('#splash-wrapper').css('display','none');
            $('#default-wrapper').css('display','none');
        });
      }

      function getSuperSizeIndex(){
        const supersize_option = nudge_index;
        let supersize_show_index = [-1];
        let supersize_show_value = [-1];
        for (let i = 0;i<payoff_matrix.length;i++){
            if (payoff_matrix[i][supersize_option] > supersize_show_value){
                supersize_show_value = [payoff_matrix[i][supersize_option]];
                supersize_show_index = [i];
            } else if (payoff_matrix[i][supersize_option] > supersize_show_value){
                supersize_show_value.push(payoff_matrix[i][supersize_option]);
                supersize_show_index.push(i);   
            }
        }
        return supersize_show_index[Math.floor(Math.random() * supersize_show_index.push.length)];
      }

      function getMatrixIndex(row, col){
        return (row * payoff_matrix[0].length) + col;
      }

      function show_supersize(option_index){
          const supersize_index = getSuperSizeIndex();
          setSplashPosition('supersize');
          $('#supersize-index-span').html(String(nudge_index+1));
          $('#supersize-number').html(String(payoff_matrix[supersize_index][nudge_index]));
          $('#supersize-letter').html(String(letter_vec[supersize_index]));
          $('#supersize-prize-prizes').html(payoff_matrix[supersize_index][nudge_index] == 1 ? 'prize!' : 'prizes!');
          $('#supersize-option-span').html(String(nudge_index+1));
          $('#original-supersize-option-span').html(String(option_index+1));
          const this_counter = getMatrixIndex(supersize_index,nudge_index);
          $(`#${this_counter}-${supersize_index+1}-${nudge_index+1}`)
            .toggleClass(`click-${inner_cost_matrix[supersize_index][nudge_index]} no-cost`)
            .removeClass('must-click')
            .css({'background':'#5f9e70','color':'white'})
            .html(payoff_matrix[supersize_index][nudge_index]);
          $('#supersize-yes').click(function(){
                $('#splash-wrapper').css('display','none');
                $('#supersize-wrapper').css('display','none');
                finishTrial(nudge_index,false,true);
            });
            $('#supersize-no').click(function(){
                $('#splash-wrapper').css('display','none');
                $('#default-wrapper').css('display','none');
                finishTrial(nudge_index,false,false);
            });
      }

      function finishTrial(option_index,accepted_default,accepted_supersize_rec){
            $('.table-element').toggleClass('after-click');
            const total_earnings = round3(compute_and_display_earnings(option_index,true)/1000);
            if (!trial.is_practice) jsPsych.top_obj.update_earnings(total_earnings);
            const chose_default = (trial.trial_type=='default' && option_index==nudge_index);
            const chose_supersize = (trial.trial_type=='supersize' && option_index==nudge_index);

            const trial_data = {
                is_practice: trial.is_practice,
                click_values:click_values,
                payoff_matrix: payoff_matrix,
                cost_matrix: cost_matrix,
                weights: weights,
                trial_num: trial.trial_num,
                selected_option: option_index,
                total_earnings: total_earnings,
                click_cost: total_click_cost,
                net_earnings:total_earnings - total_click_cost,
                uncovered_values: uncovered_values,
                trial_type:trial.trial_type,
                nudge_index:nudge_index,
                accepted_default:accepted_default,
                accepted_supersize:accepted_supersize_rec,
                chose_default: chose_default,
                chose_supersize:chose_supersize
            };
            $("#continue").click(function() {
                jsPsych.finishTrial(trial_data);
            });
      }


      function choose_option(option_index,accepted_default=false,accepted_supersize_rec=false){
            if (trial.trial_type=='supersize' && option_index!=nudge_index){
                show_supersize(option_index);
            } else{
                finishTrial(option_index,accepted_default,accepted_supersize_rec)
            }
      }


  
      function make_table(){
          const total_prizes_string = 'Prizes'//`${total_prizes} prizes`
          const num_rows = payoff_matrix.length;
          const num_cols = payoff_matrix[0].length;
          let table_html = '<table id="implicit-table">';
          const flattened_costs = cost_matrix.flat();
          const flattened_values = payoff_matrix.flat();
          let counter=0;
          for (let row=0;row<=num_rows;row++){
              if (row==0){
                  table_html += `<tr class = "table-row top-row"">`
                  for (let col=0;col<=num_cols;col++){
                      if (col!=0) {
                          table_html += `<td class = "table-element option-info" id="option-${String(col)}">Basket ${String(col)}</td>`
                      } else{
                          table_html += `<td class = "table-element total-info">${total_prizes_string}</td>`
                      }
                  }
              } else{
                const curr_letter = letter_vec[row-1]
                  table_html += `<tr class = "table-row" id="row-${String(row)}">`
                  for (let col=0;col<=num_cols;col++){
                      if (col==0){
                          const curr_points = weights[row-1] == 1 ? 'point' : 'points';
                          table_html += `<td class = "table-element color-info">${curr_letter}: ${String(weights[row-1])} ${curr_points}</td>`
                      } else{
                          if (flattened_values[counter] ==1){
                              var point_str = 'prize'
                          } else{
                              var point_str = 'prizes'
                          }
                          if (flattened_costs[counter]==0){
                              table_html += `<td class = "table-element not-highlighted no-cost col-${String(col)}" id="num-${String(counter)}">`;
                              table_html += `<span class="payoff-info" id = "payoff-${counter}">${flattened_values[counter]} ${point_str}</span>`;
                            } else{
                              table_html += `<td class = "table-element not-highlighted must-click click-${String(flattened_costs[counter])} col-${String(col)}" id="${counter}-${row}-${col}">`;
                              table_html += `<span id = 'inner-td-${row}${col}'>?</span>`;
                        }
                        table_html += `</td>`
                        counter=counter+1;
                      }
                    }
                }
          table_html += '</tr>'
          }
          table_html += '</table>';
          return table_html;
      }

      function compute_and_display_earnings(selection,show){
        let new_bottom = '<p class = "computer-number bottom-p">You won <span>'
        let curr_points_earned = 0;
        for (let i=0;i<weights.length;i++){
            const curr_val = weights[i]
            const curr_num = payoff_matrix[i][selection]
            curr_points_earned += curr_num*weights[i]
            const inner_str = i==weights.length-1 ? ' and ' : '';
            //const curr_points_str = curr_val==1 ? 'point' : 'points';
            const curr_prize_str = curr_num==1 ? 'prize' : 'prizes';
            const curr_letter = letter_vec[i]
            const curr_html = `${inner_str} ${curr_num} ${curr_letter} ${curr_prize_str}`  + (i==weights.length-1 ? '' : ',')//(${curr_val} ${curr_points_str} each), `
            new_bottom = new_bottom + curr_html;
        }
        new_bottom += `</span>, for a total of <span>${curr_points_earned} points</span>.<br> Total earnings (prize values minus click cost): <span>$${round3((curr_points_earned - total_click_cost)/1000).toFixed(3)}</span>.</p><p><button id='continue' class='jspsych-btn'> Continue </button></p>`
        $('#result-info').html(new_bottom)
        if (show===true){
            $('#result-info').css('visibility','visible')
        }
        return curr_points_earned;
    }

    function interactive_effects(){
        // options hover on the entire column
        $('.option-info').hover(function(){
            const num = this.id.slice(7)
            $(`.col-${num}`).toggleClass('not-highlighted highlighted');
            $(`.question-${num}`).toggleClass('question-mark-display');
        })


        $('.must-click').on('click',function(){
            let [num, row, col] = this.id.split('-').map(d=>+d);
            const curr_class = this.className;
            click_values.push(num);
            if (curr_class.includes('click')){
              inner_cost_matrix[row-1][col-1] --;
              total_click_cost ++;
              document.getElementById('click-cost-tracker').innerHTML = String(total_click_cost) + (total_click_cost==1 ? ' point' : ' points');
              if (curr_class.includes('click-1')){
                  uncovered_values.push(+num);
                  $(this).toggleClass('click-1 no-cost');
                  $(`#inner-td-${row}${col}`).html(`${payoff_matrix[row-1][col-1]}`);
                  $(this).removeClass('must-click');
                  //$(`#payoff-${num}`).toggleClass('payoff-click hover-class');
                } else if (curr_class.includes('click-2')){
                    $(this).toggleClass('click-2 click-1')
                } else if (curr_class.includes('click-3')){
                  $(this).toggleClass('click-3 click-2')
                } else if (curr_class.includes('click-4')){
                  $(this).toggleClass('click-4 click-3')
                }
            }
        })
        $('.option-info').on('click',function(){
            const selected_option = +this.id.slice(7)
            choose_option(selected_option-1);
        })
    }
    
        function columnSums(array) {
            return array.reduce((a, b)=>
            a.map((x, i)=>            
                x + (b[i] || 0)
            )
            )
        };

      function chooseNudgeOption(){
        const col_sums = columnSums(payoff_matrix);
        const max_of_array =  col_sums.indexOf(Math.max(...col_sums));
        return max_of_array;
      }
      

    function makePayoffMatrix(){
        let payoff_matrix = [];
        let cost_matrix = [];
        const normal_function = makeGaussianFunction(5,1.5);
        for (let prizei=0;prizei<trial.num_prizes;prizei++){
            payoff_matrix.push([]);
            cost_matrix.push([]);
            for (let basketi=0;basketi<trial.num_baskets;basketi++){
                const curr_sample = Math.round(normal_function());
                const curr_cutoff_sample = Math.max(Math.min(curr_sample,10),0);
                payoff_matrix[prizei].push(curr_cutoff_sample);
                cost_matrix[prizei].push(trial.cost_val);
            }
        }
        return [payoff_matrix,cost_matrix];
    }

      const splash_stuff = "<div id = 'splash-wrapper'>" +
        "<div id = 'splash'>"+
            "<div id = 'default-wrapper' class = 'splash-text-wrapper'>"+
                "<div id = 'default-text' class = 'splash-text'>Do you want to choose basket <span id = 'default-index-span'></span>?</div>"+
                "<div id = 'default-text' class = 'splash-text'>It's pays the most when the prizes are equally valuable.</div>"+
                "<div id = 'default-button' class = 'splash-button-wrapper'>"+
                    "<button id='default-yes' class='splash-button jspsych-btn'>Yes</button>"+
                    "<button id='default-no' class='splash-button jspsych-btn'>No</button></div>"+
            "</div><div id = 'supersize-wrapper' class = 'splash-text-wrapper'>"+
                "<div class = 'splash-text'>Are you sure you don't want basket <span id = 'supersize-index-span'></span>?</div>"+
                "<div class = 'splash-text'>It has <span id = 'supersize-number'></span> <span id = 'supersize-letter'> </span> <span id = 'supersize-prize-prizes'></span></div>"+
                "<div id = 'supersize-buttons' class = 'splash-button-wrapper'>"+
                    "<button id='supersize-yes' class='splash-button jspsych-btn'> Go with basket <span id = 'supersize-option-span'></span></button>"+
                    "<button id='supersize-no' class='splash-button jspsych-btn'> Stick with basket <span id = 'original-supersize-option-span'></span></button></div>"+
            "</div>"+
        "</div></div>";


      // setup

      let click_values = [];
      let total_click_cost = 0;
      let uncovered_values = [];
      const letter_vec = ['A','B','C','D','E','F'];
      const [payoff_matrix, cost_matrix] = makePayoffMatrix();
      let inner_cost_matrix = cost_matrix;
      const weights = getWeights();
          

      const bottom_info = '<div id = "bottom-info"></div>';
      display_element.innerHTML = splash_stuff+'<div id="table-wrapper"></div>'+bottom_info;
      document.getElementById('table-wrapper').innerHTML = make_table() + '<div id=legend></div>';
      document.getElementById('bottom-info').innerHTML = "<div><p class = 'computer-number'>Total click cost: <span id = 'click-cost-tracker'>0 points</span></p></div><div id = 'result-info'></div>";
      const times = cost_matrix[0][0] == 1 ? 'time' : 'times';
      const legend_html = `<div><div class="legend-text">Click a box ${cost_matrix[0][0]} ${times} to reveal it</div><div class="legend-text">On average, a basket has 5 prizes of each type</div><div class="legend-text">Baskets may have different total numbers of prizes</div></div>`;
      $('#legend').html(legend_html)
 
  
      compute_and_display_earnings(1,false);// just to make sure spacing works .
      interactive_effects();
      const nudge_index = (trial.trial_type=='control') ? -1 : chooseNudgeOption();
      if (trial.trial_type == 'default') show_default();

    };
  
    return plugin;
  })();
  