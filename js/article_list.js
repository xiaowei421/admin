$(function() {
    $.ajax({
        url: BigNew.category_list,
        datatype: 'json',
        success: function(res) {
            if (res.code === 200) {
                // 将获取的文章数据渲染到页面
                $('#selCategory').html(template('articleidtemplate', res));
            };
        }
    });

    let page = 1 // 当前页码
    let perpage = 10 // 每页显示的数量

    //1,文章搜索，更新数据
    // 请求地址：/admin/category / list
    // 请求方式：get
    // 请求参数：无
    // 返回数据：文章
    init();
    // 封装查询
    function init() {
        $.ajax({
            url: BigNew.article_query,
            data: {
                perpage,
                page,
                type: $('#selCategory').val(),
                state: $('#selStatus').val()
            },
            datatype: 'json',
            success: function(res) {
                if (res.code === 200) {
                    // 1.2 将获取的文章数据渲染到页面
                    $('tbody').html(template('articletemplate', res.data));
                    // 1.2 调用分页函数,使用插件有一个bug当没有数据无法捕捉会进行报错，所以判定长度进行赋值
                    if (res.data.totalPage > 1) {
                        //1.3 判定页面数据为0时显示页面为页码总数量
                        if (res.data.data.length === 0) {
                            // 1.4 将页面总数量赋值为显示页面
                            page = res.data.totalPage;
                            // 1.5更新数据
                            init();
                        };
                        setPage(res.data.totalPage);
                    } else {
                        setPage(1);
                    };
                };
            }
        });
    };

    //2请求地址：/admin/category/list
    // 请求方式：get
    // 请求参数：无
    // 返回数据：文章
    // 注意点使用下拉列表需要自定义文章类型id,文章状态，
    $('#btnSearch').on('click', function() {
        //因筛选后页面不确定是有多少页，所以需要重置
        page = 1;
        //2.1调用更新数据函数
        init();
        //2.2发送请求

        return false
    });

    //3，使用分页插件的重点属性
    /*
    - bootstrapMajorVersion：它来设置当前的bootstrap的版本，不同的版本所需要的分页结构不一样
      - 3.X ---ul
      - 2.X ---div
    - currentPage:当前页码，后期与ajax请求中的页码对应,它的作用看上去可以为当前页码添加样式
    - totalPages：总页数，一般后台都会有返回
    - onPageClicked：单击页码所触发的事件，单击页码需要加载这一页的数据
    */

    /**
     *
     * @param pageCurrent 当前所在页
     * @param pageSum 总页数
     * @param callback 调用ajax
     */
    function setPage(total) {
        $(".pagination").bootstrapPaginator({
            //3.1设置版本号
            bootstrapMajorVersion: 3,
            // 3.2显示第几页
            currentPage: page,
            // 3.3总页数
            totalPages: total,
            //3.4当单击操作按钮的时候, 执行该函数, 调用ajax渲染页面
            onPageClicked: function(event, originalEvent, type, cpage) {
                // console.log(cpage);
                //3.5设置显示页为当前点击页码
                // if (cpage.data.data.length > 1) {
                //     cpage--
                // };
                page = cpage;
                //3.6调用更新数据函数
                init();
            }
        });
    };

    // 4,删除文章
    // 请求地址：/admin/article/delete
    // 请求方式：post
    // 请求参数：
    $('tbody').on('click', '.delete', function() {
        //4.1，获取自定义存储的id
        const id = $(this).data('id');
        if (confirm('是否真的需要删除？')) {
            $.ajax({
                type: 'post',
                url: BigNew.article_delete,
                data: { id },
                dataType: 'json',
                success: function(res) {
                    if (res.code == 204) {
                        alert(res.msg);
                        // 刷新不能直接设置init，而是需要进行一些处理
                        init();
                        // window.location.reload();
                    };
                }
            });
        };
    });
});