//
//  HomeViewController.swift
//  Telehealth
//
//  Created by Giap Vo Duc on 9/22/15.
//  Copyright © 2015 Giap Vo Duc. All rights reserved.
//

import UIKit
import Socket_IO_Client_Swift
import SwiftyJSON

class HomeViewController: UIViewController,UIPopoverPresentationControllerDelegate,MyPopupViewControllerDelegate{
    var uid = String()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        //Get uuid user in locacalstorage
        if let uuid = defaults.valueForKey("uid") as? String {
            uid = uuid
        }
        if let token = defaults.valueForKey("token") as? String {
            tokens = token
        }
        if let coreToken = defaults.valueForKey("coreToken") as? String {
            coreTokens = coreToken
        }
        openSocket()
       
    }
    
    override func viewWillAppear(animated: Bool) {
        
    }
    

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        
    }
    //Giap: Change view AnswerCall by StoryboardID
    func AnswerCall(){
       
        self.displayViewController(.TopBottom)
    }
    
    //display popup call
    func displayViewController(animationType: SLpopupViewAnimationType) {
       
        let myPopupViewController:MyPopupViewController = MyPopupViewController(nibName:"MyPopupViewController", bundle: nil)
        myPopupViewController.delegate = self
        self.presentpopupViewController(myPopupViewController, animationType: animationType, completion: { () -> Void in
            
        })
        
       
        
    }

    @IBAction func ContactUsAction(sender: AnyObject) {
       
        callAlertMessage("", message: MessageString.QuestionCallPhone)
    }
    
    //Giap: Show alert message
    func callAlertMessage(title : String,message : String){
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .Alert)
        let cancelAction = UIAlertAction(title: "Cancel", style: .Cancel) { (action) in
            // ...
        }
        alertController.addAction(cancelAction)
        let OKAction = UIAlertAction(title: "OK", style: .Default) { (action) in
             UIApplication.sharedApplication().openURL(NSURL(string: "tel://0892300900")!)
        }
        alertController.addAction(OKAction)
        
        self.presentViewController(alertController, animated: true) {
            
        }
    }
    
    //MARK: MyPopupViewControllerProtocol
    func pressOK(sender: MyPopupViewController) {
      self.dismissPopupViewController(.Fade)
        emitDataToServer(MessageString.CallAnswer, uidFrom: uid, uuidTo: savedData.data[0]["from"].string!)
        let homeMain = self.storyboard?.instantiateViewControllerWithIdentifier("ScreenCallingStoryboard") as! ScreenCallingViewController
        self.presentViewController(homeMain, animated: true, completion: nil)
        
    }
    func pressCancel(sender: MyPopupViewController) {
         emitDataToServer(MessageString.Decline, uidFrom: uid, uuidTo: savedData.data[0]["from"].string!)
            self.dismissPopupViewController(.Fade)
    }

    func emitDataToServer(message:String,uidFrom:String,uuidTo:String){
        let modifieldURLString = NSString(format: UrlAPISocket.emitAnswer,uidFrom,uuidTo,message) as String
        let dictionNary : NSDictionary = ["url": modifieldURLString]
        sharedSocket.socket.emit("get", dictionNary)
    }
    
    func openSocket() {
        dispatch_async(dispatch_get_main_queue(), { () -> Void in
            // Called on every event
            sharedSocket.socket.onAny {
                //                print("got event: \($0.event) with items \($0.items)")
                let a = $0.event
                let b = $0.items
            }
            // Socket Events
            sharedSocket.socket.on("connect") {data, ack in
                print("socket connected")
                print("\(self.uid)")
                let modifieldURLString = NSString(format: UrlAPISocket.joinRoom, self.uid) as String
                let dictionNary : NSDictionary = ["url": modifieldURLString]
                sharedSocket.socket.emit("get", dictionNary)
            }
            
            sharedSocket.socket.on("receiveMessage"){data, ack in
                print("calling to me")
                let dataCalling = JSON(data)
                
                let message : String = data[0]["message"] as! String
                print("message:",message)
                if message == MessageString.Call {
                    //save data to temp class
                    savedData = saveData(data: dataCalling)
                    self.displayViewController(.TopBottom)
                    NSNotificationCenter.defaultCenter().postNotificationName("AnswerCall", object: self)
                }else if message == MessageString.CallEndCall {
                    NSNotificationCenter.defaultCenter().postNotificationName("endCallAnswer", object: self)
                }else if message == MessageString.Cancel {
                    NSNotificationCenter.defaultCenter().postNotificationName("cancelCall", object: self)
                }
                
            }
        })
        //Socket connecting
        sharedSocket.socket.connect()

    }

   


 

}