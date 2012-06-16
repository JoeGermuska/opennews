$(function(){
    function show_gender_breakdown(data) {
        $("#male-population").html(ire_census.sf1val(data,'PCT012002','2010'));
        $("#female-population").html(ire_census.sf1val(data,'PCT012106','2010'));
        $("#male-pct").html(ire_census.sf1val_pct(data,'PCT012002','2010'));
        $("#female-pct").html(ire_census.sf1val_pct(data,'PCT012106','2010'));
        $("#total-population").html(ire_census.sf1val(data,'PCT012001','2010'));
    }
    function render_profile(data) {
        $("#name").html(data.metadata.NAME);
        show_gender_breakdown(data);
    }
    $(document).ready(function() {
        data = ire_census.do_with_sf1_data('1714000',render_profile)
        $("#geoid-form").submit(function() { ire_census.do_with_sf1_data($("#geoid").val(),render_profile); return false; })
    });

});