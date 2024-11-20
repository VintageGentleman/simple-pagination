/**
 * simple pagination plugin v1.0
 * Date: 2024-11-20T02:30:24.145Z
 * author: gitae.hong
 * 
 * Please read 'example.html' file.
 * That file has how to use it and an example.
 */
(function($) {
    "use strict"

    $.fn.pagination = function (options) {

        // status
        let totalCount = 0;  // total data row count
        let nowPage = 1;     // current page
        let totalPageCnt;    // total page number
        let pageSizeNum;     // view number of current page
        let startPageNum;    // page start number of current view
        let endPageNum;      // page end number of current view 

        let prevStartPageNum;// page number on prev button click
        let nextEndPageNum;  // page number on next button click

        // default option
        let settings = $.extend({
            pageSize : 10,       // Number of rows to display on a page
            pageNumSize : 10,    // Number of pages to display on a view
            pagingType : 'default', //Page Jump Button configuration types (default[prev,next], full[first,prev,next,end])
            onPageClick : null   // Function on Number and Page Jump Button click
        }, options);
            
        let $container = $(this);
        $container.addClass('pagination-container')
        $container.empty();

        function adjustStatus(currentPage, totalCnt) {
            if(typeof currentPage !== 'undefined') {
                nowPage = currentPage;
            }

            if(typeof totalCnt !== 'undefined') {
                totalCount = totalCnt;
            }

            totalPageCnt = Math.floor(totalCount / settings.pageSize) + (totalCount % settings.pageSize == 0 ? 0 : 1);
            pageSizeNum = Math.floor(nowPage / settings.pageNumSize) + (nowPage % settings.pageNumSize == 0 ? 0 : 1);		
            startPageNum = pageSizeNum * settings.pageNumSize - settings.pageNumSize + 1;	
            endPageNum = startPageNum + settings.pageNumSize - 1;
            endPageNum = totalPageCnt < endPageNum ? totalPageCnt : endPageNum;
            prevStartPageNum = startPageNum - settings.pageNumSize;
            prevStartPageNum = prevStartPageNum < 1 ? 1 : prevStartPageNum;
            nextEndPageNum = startPageNum + settings.pageNumSize;        
        }

        function renderPagination() {
            $container.empty();

            if(totalCount === 0) {
                return;
            }

            if(settings.pagingType === 'full') {
                let toStartBtn = $('<button class="page-toStart-btn"><<</button>');
                
                if(startPageNum > 1) {
                    toStartBtn
                        .data('page', 1)
                        .addClass('active')
                        .on('click', fnPageClick);
                } else {
                    toStartBtn.prop('disabled', true);
                }
                $container.append(toStartBtn);
            }

            let prevBtn = $('<button class="page-prev-btn"><</button>');

            if(startPageNum > 1) {
                prevBtn
                    .data('page', prevStartPageNum)
                    .addClass('active')
                    .on('click', fnPageClick);
            } else {
                prevBtn.prop('disabled', true);
            }

            $container.append(prevBtn);

            for (var i = startPageNum; i <= endPageNum; i++) {
                var $page = $('<a class="page-item"></a>')
                    .text(i)
                    .data('page', i);
                
                if(nowPage === i) {
                    $page.addClass('active');
                }

                $page.on('click', fnPageClick);

                $container.append($page);
            }

            let nextBtn = $('<button class="page-next-btn">></button>')

            if(totalPageCnt > endPageNum) {
                nextBtn
                    .data('page', nextEndPageNum)
                    .addClass('active')
                    .on('click', fnPageClick);
            } else {
                nextBtn.prop('disabled', true);
            }
            $container.append(nextBtn);

            if(settings.pagingType === 'full') {
                let toEndBtn = $('<button class="page-toEnd-btn">>></button>');
                
                if(totalPageCnt > endPageNum) {
                    toEndBtn
                        .data('page', totalPageCnt)
                        .addClass('active')
                        .on('click', fnPageClick);
                } else {
                    toEndBtn.prop('disabled', true);
                }
                $container.append(toEndBtn);
            }

            
        }

        function fnPageClick() {
            var selectedPage = $(this).data('page');
            if (typeof settings.onPageClick === 'function') {
                settings.onPageClick(selectedPage); // callback
            } else {
                adjustStatus(selectedPage);
                renderPagination();    
            }
        }

        this.getCurrentPage = function () {
            return nowPage;
        };

        // rendering
        this.draw = function(currentPage = 1, totalCnt) {
        
            if(!$.isNumeric(currentPage)) {
                throw new Error('currentPage must be number');
            };

			if(typeof totalCnt !== 'undefined') {
				if(!$.isNumeric(totalCnt)) {
                    throw new Error('totalCnt must be number');
                };
			}

            adjustStatus(currentPage, totalCnt);

			if(currentPage < 1 || (totalPageCnt !== 0 && currentPage > totalPageCnt)) {
                throw new Error('CurrentPage must be greater than or equal to 1 but less than equal to a totalPageCnt');
            }

            renderPagination();
        };

        return this; // jQuery chain possible
    }
}(jQuery)); 