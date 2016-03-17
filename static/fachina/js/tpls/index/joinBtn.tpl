{{if status === '1'}}
  <a href="javascript:J_app.userLogin();" class="index-join-event J-touch">我要参赛</a>
{{else if status === '2'}}
  <a href="./enroll_entry.html" class="index-join-event J-touch">我要参赛</a>
{{else if status === '3'}}
  <a href="javascript:;" class="btn btn-gray btn-fixed-large disabled" style="width:2.5rem;">审核中</a>
{{else}}
  <a href="javascript:;" class="btn btn-orange btn-fixed-large J-touch J-invite-alone" style="width:2.5rem;">转发拉票</a>
{{/if}}