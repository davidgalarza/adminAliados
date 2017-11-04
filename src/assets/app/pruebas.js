var DatatableColumnRenderingDemo = function () {
    var t = function () {
        var t = $(".m_datatable").mDatatable({
            data: {
                type: "local",
                source: JSON.parse(localStorage.getItem("products")),
                pageSize: 10, saveState: { cookie: !0, webstorage: !0 }, serverPaging: !0, serverFiltering: !0, serverSorting: !0
            },
            layout: {
                theme: "default",
                class: "", scroll: !1, height: 550, footer: !1
            },
            sortable: !0,
            filterable: !1,
            pagination: !0,
            columns: [
                {
                    field: "RecordID",
                    title: "#", sortable: !1,
                    width: 40, textAlign: "center",
                    selector: { class: "m-checkbox--solid m-checkbox--brand" }
                },
                {
                    width: 200,
                    field: "product", title: "Producto", template: function (t) { var e = mUtil.getRandomInt(1, 14), a = t.imageUrl; output = '<div class="m-card-user m-card-user--sm">\t\t\t\t\t\t\t\t<div class="m-card-user__pic">\t\t\t\t\t\t\t\t\t<img src="' + a + '" class="m--img-rounded m--marginless" alt="photo">\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t\t<div class="m-card-user__details">\t\t\t\t\t\t\t\t\t<span class="m-card-user__name">' + t.product + '</span>\t\t\t\t\t\t\t\t\t<a href="" class="m-card-user__email m-link">' + t.description + "</a>\t\t\t\t\t\t\t\t</div>\t\t\t\t\t\t\t</div>"; return output }
                },
                {
                    field: "menu",
                    title: "Menu",
                    width: 150, template: function (t) { return t.menu.toUpperCase() }
                },
                {
                    field: "price", title: "Precio", width: 200
                },
                {
                    field: "Actions",
                    width: 110,
                    title: "Acciones",
                    sortable: !1,
                    overflow: "visible",
                    template: function (t) {
                        return '<a data-cust-id="' + t.key + '"class="editB m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\t\t\t\t\t\t\t<i class="la la-edit"></i>\t\t\t\t\t\t</a>\t\t\t\t\t\t<a data-cust-id="' + t.key + '" class="deleteB m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Eliminar">\t\t\t\t\t\t\t<i class="la la-trash"></i>\t\t\t\t\t\t</a>\t\t\t\t\t'
                    }
                }
            ]
        }),
            e = t.getDataSourceQuery();
        $("#m_form_search").on("keyup", function (e) {
            var a = t.getDataSourceQuery();
            a.generalSearch = $(this).val().toLowerCase(), t.setDataSourceQuery(a), t.load()
        }).val(e.generalSearch), $("#m_form_status").on("change", function () { var e = t.getDataSourceQuery(); e.menu = $(this).val().toLowerCase(), t.setDataSourceQuery(e), t.load() }).val(void 0 !== e.menu ? e.menu : ""), $("#m_form_type").on("change", function () { var e = t.getDataSourceQuery(); e.Type = $(this).val().toLowerCase(), t.setDataSourceQuery(e), t.load() }).val(void 0 !== e.Type ? e.Type : ""), $("#m_form_status, #m_form_type").selectpicker()
    }; return { init: function () { t() } }
}(); 
jQuery(document).ready(function () { DatatableColumnRenderingDemo.init() });