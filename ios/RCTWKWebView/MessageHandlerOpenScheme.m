//
//  MessageHandlerOpenScheme.m
//  WkwebviewSample
//
//  Created by LoveStar_PC on 6/21/16.
//
//

/**
    Will try to open the URLm then return result in callback
    :param : JSON
 */
#import "MessageHandlerOpenScheme.h"


@interface MessageHandlerOpenScheme()

@end

@implementation MessageHandlerOpenScheme
- (void) userContentController:(WKUserContentController *) userContentController didReceiveScriptMessage:(WKScriptMessage *) message {
    NSDictionary * parsed = [self getParsedJSON:message];
    NSString * callback = parsed[@"callback"];
    NSString * urlscheme = parsed[@"urlscheme"];
    
    BOOL success = [[UIApplication sharedApplication] openURL:[NSURL URLWithString:urlscheme]];
    NSString * js = [NSString stringWithFormat:@"%@(%@,\"%@\");", callback, success ? @"true" : @"false", urlscheme];
    [self.parent.webView evaluateJavaScript:js completionHandler:nil];
    
}
    /**
        Helper functio that will try to parse AnyObject to JSON and return as NSDictionary
        :param: AnyObject (id)
        :returns: JSON object as NSDictionary if oarsing is successful, otherwise nil
     */
- (NSDictionary *) getParsedJSON:(id) object {
    @try {
        NSString * jsonString = (NSString *) object;
        NSData * jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
        
        NSDictionary * parsed = [NSJSONSerialization JSONObjectWithData:jsonData options:NSJSONReadingAllowFragments error:nil];
        return parsed;

    } @catch (NSException *exception) {
        NSLog(@"A JSON parding error occurred:\n %@", exception);
    } @finally {
        
    }
    return nil;
}
@end
