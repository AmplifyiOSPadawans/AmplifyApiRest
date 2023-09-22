//
//  Book.swift
//  AmplifyApiRest
//
//  Created by David Perez Espino on 21/09/23.
//

import Foundation

class Book: Codable {
    var id: String
    var author: String
    var title: String
    var gender: String
    var release_date: String
    
    init(author: String, title: String, gender: String, release_date: String) {
        self.id = UUID().uuidString
        self.author = author
        self.title = title
        self.gender = gender
        self.release_date = release_date
    }
}

extension Book {
    func toString() -> String {
        return #"{"id":"\#(self.id)","author":"\#(self.author)","title":"\#(self.title)","gender":"\#(self.gender)","releaseDate":"\#(self.release_date)"}"#
    }
}
