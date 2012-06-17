$(function(){

    function render_profile(data) {
        $("#name").html(data.metadata.NAME);
        show_gender_breakdown(data);
        return data;
    }

    function show_gender_breakdown(data) {
        breakdown = age_breakdown(data, 'PCT012', '2010');
        render_age_chart(breakdown);
    }

    function make_padded_key(table,fieldnum) {
        fieldnum += ""
        while (fieldnum.length < 3) {
            fieldnum = "0" + fieldnum;
        }
        return table + fieldnum;
    }

    function age_breakdown(data,group,year) {
        if (!year) { year = '2010' }
        // male = PCT012003..102
        // female = PCT12107..206
        breakdown = {'male': [], 'female': [], 'total': [] };
        breakdown.place = data.metadata.NAME;
        i = 0;
        for (var i = 0; i < 100; i++ ){
            breakdown['male'][i] = Number(ire_census.sf1val(data,make_padded_key(group,i+3),year))
            breakdown['female'][i] = Number(ire_census.sf1val(data,make_padded_key(group,i+107),year))
            breakdown['total'][i] = parseInt(breakdown['male'][i]) + parseInt(breakdown['female'][i])

        }
        return breakdown;
    }

    // breakdown will be an array of objects
    // each object has female, male, total, place
    function render_age_chart(breakdown) {

        var series = [
            {name:'female', data:breakdown.female},
            {name:'male', data:breakdown.male}];

        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'chart',
                type: 'line',
                marginRight: 130,
                marginBottom: 25
            },
            plotOptions: {
                        line: {
                            dataLabels: {
                                // enabled: true
                            },
                            shadow: false,
                            lineWidth: 3,
                            marker: {
                                enabled: false,
                                radius: 3,
                                lineWidth: 0,
                                symbol: 'circle'
                            }
                        }
                    },
            title: {
                text: 'Population by Gender'
            },
            subtitle: {
                text: ''
            },
            yAxis: {
                title: {
                    text: ''
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
            },
            legend: {
            },
            series: series
        });



    }

    window.age_breakdown = age_breakdown;

    $(document).ready(function() {
        data = ire_census.do_with_sf1_data('1714000',render_profile);
        $("#geoid-form").submit(function() { ire_census.do_with_sf1_data($("#geoid").val(),render_profile); return false; })
    });

});