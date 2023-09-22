//
//  ApiHelper.swift
//  AmplifyApiRest
//
//  Created by David Perez Espino on 21/09/23.
//

import Amplify

class ApiHelper {
    
    func postBook(book: Book) async -> Bool {
        let message = book.toString()
        
        let request = RESTRequest(path: "/books", body: message.data(using: .utf8))
        
        do {
            let data = try await Amplify.API.post(request: request)
            let str = String(decoding: data, as: UTF8.self)
            print("Success: \(str)")
            return true
            
        } catch let error as APIError {
            
            print("Failed due to API error: ", error)
        } catch {
            
            print("Unexpected error: \(error)")
        }
        
        return false
    }
}
