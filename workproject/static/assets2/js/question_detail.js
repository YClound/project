var ATTACH_ACCESS_KEY
var COMMENT_UNFOLD;
var QUESTION_ID;
var UNINTERESTED_COUNT;

$(function()
{
    //问题页点击添加评论
  AWS.Init.init_comment_box('.aw-add-comment');
	
	if ($('#c_log_list').attr('id'))
	{
		AWS.load_list_view(G_BASE_URL + '/question/ajax/log/id-' + QUESTION_ID, $('#bp_log_more'), $('#c_log_list'));
	}
	else
	{
		ITEM_IDS = ITEM_IDS.split(',');

		if ($('.aw-upload-box').length)
		{
			var fileupload = new FileUpload('file', '.aw-upload-box .btn', '.aw-upload-box .upload-container', G_BASE_URL + '/publish/ajax/attach_upload/id-answer__attach_access_key-' + ATTACH_ACCESS_KEY)
		}
		
		//折叠回复
		$.each($('.aw-question-comment .aw-item'), function (i, e) 
		{
			if ($(this).attr('uninterested_count') >= UNINTERESTED_COUNT || $(this).attr('force_fold') == 1)
			{
				$('#uninterested_answers_list').append($(e));
			}
		});
		
		//折叠回复数量
		if ($('#uninterested_answers_list div.aw-item').length > 0)
		{
			$('#load_uninterested_answers span.hide_answers_count').html($('#uninterested_answers_list div.aw-item').length);
			$('#load_uninterested_answers').fadeIn();
		}

		//回复折叠显示按钮
	    $('#load_uninterested_answers a').click(function()
	    {
	    	$('#uninterested_answers_list').toggle();
	    });
		
		//自动保存草稿
		$('textarea.wmd-input').bind('blur', function() {
			if ($(this).val() != '')
			{
				$.get(API.saveDraftAnswer + '?item_id-' + QUESTION_ID + 'message=' + $(this).val(), function (result) {
					$('#answer_content_message').html(result.err + ' <a href="#" onclick="$(\'textarea#advanced_editor\').attr(\'value\', \'\'); AWS.User.delete_draft(QUESTION_ID, \'answer\'); $(this).parent().html(\' \'); return false;">' + _t('删除草稿') + '</a>');
				}, 'json');
			}
		});
		
		//自动展开评论
    // 点击展开评论
		if (COMMENT_UNFOLD == 'all')
		{
			$('.aw-add-comment').click();
		}
		else if (COMMENT_UNFOLD == 'question')
		{
			$('.aw-question-detail-meta .aw-add-comment').click();
		}
		
		//回复高亮
		$.each(ITEM_IDS, function (i, answer_id) {
			if ($('#answer_list_' + answer_id).attr('id'))
			{
				if ($('#answer_list_' + answer_id).find('.aw-add-comment').data('comment-count') > 0)
				{
					$('#answer_list_' + answer_id).find('.aw-add-comment').click();
				}
						
				AWS.hightlight($('#answer_list_' + answer_id), 'active');
			}
		});
	}
	
	//关注用户列表
	$.get( API.question +"?id"+ QUESTION_ID, function (result) {
		if (result)
		{
			$.each(result, function (i, e) {
				if (e['uid'])
				{
					$('#focus_users').append('<a href="' + e['url'] + '"><img src="' + e['avatar_file'] + '" class="aw-user-name" data-id="' + e['uid'] + '" alt="' + e['user_name'] + '" /></a> ');
				}
				else
				{
					$('#focus_users').append('<a href="javascript:;" title="' + _t('匿名用户') + '"><img src="' + e['avatar_file'] + '" alt="' + _t('匿名用户') + '" /></a> ');
				}
			});
		}
	}, 'json');
	
    //邀请回答按钮操作
    $('.aw-question-detail .aw-invite-replay').click(function()
    {
      // 隐藏相关问题的div
    	$('.aw-question-detail .aw-comment-box, .aw-question-detail .aw-question-related-box').hide();
    	if ($('.aw-question-detail .aw-invite-box').is(':visible'))
    	{
    		$('.aw-question-detail .aw-invite-box').fadeOut();
    	}
    	else
    	{
    		$('.aw-question-detail .aw-invite-box').fadeIn();
    	}
    });
    
    //邀请初始化 显示前四个列表
    for (var i = 0; i < 4; i++)
    {
    	$('.aw-question-detail .aw-invite-box ul li').eq(i).show();
    }
    
    // 邀请翻页
    if ($('.aw-question-detail .aw-invite-box .mod-body ul li').length <=4 )
    {
    	//长度小于4翻页隐藏
    	$('.aw-question-detail .aw-invite-box .mod-footer').hide();
    }
    else
    {
      // 列表长度大于四个时
    	//邀请上一页
	    $('.aw-question-detail .aw-invite-box .prev').click(function()
	    {
        // 当按钮没有active时
	    	if (!$(this).hasClass('active'))
	    	{
	    		var attr = [];
		    	$.each($('.aw-question-detail .aw-invite-box .mod-body ul li'), function (i, e)
		    	{
            // 如果列表显示将index值添加到数组中
		    		if ($(this).is(':visible') == true)
		    		{
		    			attr.push($(this).index());
		    		}
		    	});
		    	$('.aw-question-detail .aw-invite-box .mod-body ul li').hide();
		    	$.each(attr, function (i, e)
		    	{
            console.log(e);
          // 当显示的是前4个列表时，显示的前四个
					if (attr.join('') == '123' || attr.join('') == '234')
					{
						$('.aw-question-detail .aw-invite-box .mod-body ul li').eq(0).show();
						$('.aw-question-detail .aw-invite-box .mod-body ul li').eq(1).show();
						$('.aw-question-detail .aw-invite-box .mod-body ul li').eq(2).show();
					}
					else
					{
		    		$('.aw-question-detail .aw-invite-box .mod-body ul li').eq(e-4).show();
					}

            // 当显示完成后设置.prev
		    		
		    		if (e-4 == 0)
		    		{
		    			$('.aw-question-detail .aw-invite-box .prev').addClass('active');
		    		}
		    	});
		    	$('.aw-question-detail .aw-invite-box .next').removeClass('active');
	    	}
	    });

	    //邀请下一页
	    $('.aw-question-detail .aw-invite-box .next').click(function()
	    {
        // 当下一页按钮不含有active时，可以使用时
	    	if (!$(this).hasClass('active'))
	    	{
				var attr = [], li_length = $('.aw-question-detail .aw-invite-box .mod-body ul li').length;
		    	$.each($('.aw-question-detail .aw-invite-box ul li'), function (i, e)
		    	{
		    		if ($(this).is(':visible') == true)
		    		{
		    			attr.push($(this).index());
		    		}
		    	});
		    	$.each(attr, function (i, e)
		    	{
            console.log(e);
		    		if (e+4 < li_length)
		    		{
		    			$('.aw-question-detail .aw-invite-box .mod-body ul li').eq(e).hide();
		    			$('.aw-question-detail .aw-invite-box .mod-body ul li').eq(e+4).show();
		    		}
            // 判断是否还有列表可以显示
		    		if (e+5 == $('.aw-question-detail .aw-invite-box .mod-body ul li').length)
		    		{
		    			$('.aw-question-detail .aw-invite-box .next').addClass('active');
		    		}
		    	});
		    	$('.aw-question-detail .aw-invite-box .prev').removeClass('active');
	    	}
	    });
    }

    //邀请用户下拉绑定
    AWS.Dropdown.bind_dropdown_list($('.aw-invite-box #invite-input'), 'invite');
    
    //邀请用户回答点击事件
	$(document).on('click', '.aw-invite-box .aw-dropdown-list a', function () {
	    AWS.User.invite_user($(this),$(this).find('img').attr('src'));
	});

	//相关链接按钮
	$('.aw-question-detail .aw-add-question-related').click(function()
	{
		$('.aw-question-detail .aw-comment-box, .aw-question-detail .aw-invite-box').hide();
    	if ($('.aw-question-detail .aw-question-related-box').is(':visible'))
    	{
    		$('.aw-question-detail .aw-question-related-box').fadeOut();
    	}
    	else
    	{
    		/*给邀请三角形定位*/
    		$('.aw-question-detail .aw-question-related-box .i-dropdown-triangle').css('left', $(this).position().left + 14);
    		$('.aw-question-detail .aw-question-related-box').fadeIn();
    	}
	});

    //回复内容超链接新窗口打开
    $('.markitup-box a').attr('target','_blank');
	
	//编辑器@人
    AWS.at_user_lists('#wmd-input');

    //赞同反对fixed滚动
    $(window).scroll(function()
    {
    	if ($('.aw-question-comment .aw-vote-bar').css('position') == 'relative')
    	{
    		$.each($('.anchor'), function (i, e)
	    	{
	    		if ($(this).parents('.aw-item').height() > parseInt($(this).parents('.aw-item').find('.markitup-box').css('line-height')) * 10)
	    		{
	    			if ($(window).scrollTop() > $(this).offset().top && $(window).scrollTop() < $(this).offset().top + $(this).parents('.aw-item').height() - $(this).parents('.aw-item').find('.vote-container').height() - 10)
		    		{
		    			$(this).parents('.aw-item').find('.aw-vote-bar').addClass('fixed');
		    		}
		    		else 
		    		{
		    			$(this).parents('.aw-item').find('.aw-vote-bar').removeClass('fixed');
		    		}
	    		}
	    	});
    	}
    });
});

function one_click_add_topic(selector, topic_title, question_id)
{
	$.post(G_BASE_URL + '/topic/ajax/save_topic_relation/', 'type=question&item_id=' + question_id + '&topic_title=' + topic_title, function (result) {
		if (result.err)
		{
			AWS.alert(result.err);
		}
		else
		{
			$('.aw-topic-editor').prepend('<a href="topic/' + result.rsm.topic_id + '" class="aw-topic-name"><span>' + topic_title + '</span></a>').hide().fadeIn();
			
			selector.hide();
		}
	}, 'json');
}