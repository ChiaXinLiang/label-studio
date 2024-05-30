from django.utils.deprecation import MiddlewareMixin
from django.conf import settings
from django.middleware.csrf import CsrfViewMiddleware

class CustomCsrfExemptMiddleware(CsrfViewMiddleware):
    def process_view(self, request, callback, callback_args, callback_kwargs):
        # 在這裡檢查 URL 是否匹配你要豁免的路徑
        if request.path.startswith('/'):
            return None  # 直接返回 None 以跳過 CSRF 檢查

        # 否則，執行默認的 CSRF 檢查
        return super().process_view(request, callback, callback_args, callback_kwargs)
