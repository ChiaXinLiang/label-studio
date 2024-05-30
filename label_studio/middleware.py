from django.http import HttpResponse
from django.utils.deprecation import MiddlewareMixin

class AllowCertainPathsMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # 在此處定義允許不經身份驗證的路徑
        allowed_paths = [
            '/data/upload/',  # 您可以在此處添加更多路徑
        ]
        
        for path in allowed_paths:
            if request.path.startswith(path):
                return None  # 直接返回 None，跳過身份驗證
        
        return None
