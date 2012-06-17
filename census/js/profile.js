$(function(){

    function render_profile(data) {
        $("#name").html(data.metadata.NAME);
        show_race_breakdown(data);
        return data;
    }

    function show_sex_breakdown(data) {
        breakdown = age_breakdown(data, 'PCT012', '2010');
        var series = [
            {name:'female', data:breakdown.female},
            {name:'male', data:breakdown.male}];
        render_age_chart("Population by Sex", series);
    }
 
    function make_padded_key(table,fieldnum) {
        fieldnum += ""
        while (fieldnum.length < 3) {
            fieldnum = "0" + fieldnum;
        }
        return table + fieldnum;
    }

    function show_race_breakdown(data) {
        races = {
            'hispanic': age_breakdown(data, 'PCT012H'),
            'white': age_breakdown(data, 'PCT012I'),
            'black': age_breakdown(data, 'PCT012J'),
            'asian': age_breakdown(data, 'PCT012L'),
            'amerind': age_breakdown(data, 'PCT012K'),
            'hawaiian': age_breakdown(data, 'PCT012M'),
            'some_other': age_breakdown(data, 'PCT012N'),
            'multi': age_breakdown(data, 'PCT012O'),
        }
        other_combined = [];
        for (var i = 0; i < races.multi.length; i++) {
            other_combined = races['amerind'] + races['hawaiian'] + races['some_other'] + races['multi']
        }
        series = [
            { name: "Hispanic", data: races.hispanic.total},
            { name: "White", data: races.white.total},
            { name: "Black", data: races.black.total},
            { name: "Asian", data: races.asian.total},
            // { name: "Native American", data: races.amerind.total},
            // { name: "Hawaiian", data: races.hawaiian.total},
            // { name: "Some Other Race", data: races.some_other.total},
            // { name: "Two or more races", data: races.multi.total},
            { name: "All Other", data: other_combined }
        ];
        render_age_chart("Population by Race", series);
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
    function render_age_chart(title, series) {

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
                text: title
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