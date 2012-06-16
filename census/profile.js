$(function(){

    function render_profile(data) {
        $("#name").html(data.metadata.NAME);
        show_gender_breakdown(data);
        return data;
    }

    function show_gender_breakdown(data) {
        breakdown = age_breakdown(data, 'PCT012', '2010');
        
    }

    function make_padded_key(table,fieldnum) {
        fieldnum += ""
        while (fieldnum.length < 3) {
            fieldnum = "0" + fieldnum;
        }
        return table + fieldnum;
    }
     window.make_padded_key = make_padded_key
    function age_breakdown(data,group,year) {
        if (!year) { year = '2010' }
        // male = PCT012003..102
        // female = PCT12107..206
        breakdown = {'male': [], 'female': [], 'total': [] };
        i = 0;
        for (var i = 0; i < 100; i++ ){
            breakdown['male'][i] = ire_census.sf1val(data,make_padded_key(group,i+3),year)
            breakdown['female'][i] = ire_census.sf1val(data,make_padded_key(group,i+107),year)
            breakdown['total'][i] = parseInt(breakdown['male'][i]) + parseInt(breakdown['female'][i])
        }
        return breakdown;
    }
    function render_age_chart(title, breakdown) {
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'gender-age-chart',
                type: 'line',
                marginRight: 130,
                marginBottom: 25
            },
            title: {
                text: title,
                x: -20 //center
            },
            xAxis: {
                title: { text: 'age' }
            },
            yAxis: {
                title: {
                    text: 'number'
                }
            },
            series: [
                'Men': breakdown['male'],
                'Women': breakdown['female']
            ]
    }
    window.age_breakdown = age_breakdown;
    $(document).ready(function() {
        data = ire_census.do_with_sf1_data('1714000',render_profile)
        $("#geoid-form").submit(function() { ire_census.do_with_sf1_data($("#geoid").val(),render_profile); return false; })
    });

});