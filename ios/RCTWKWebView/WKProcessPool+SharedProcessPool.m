#import <WebKit/WebKit.h>
#import <Foundation/Foundation.h>
#import "WKProcessPool+SharedProcessPool.h"

@implementation WKProcessPool (SharedProcessPool)

+ (WKProcessPool*)sharedProcessPool {
    static WKProcessPool* _sharedProcessPool;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _sharedProcessPool = [[WKProcessPool alloc] init];
    });
    return _sharedProcessPool;
}

@end
