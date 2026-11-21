/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
/* eslint-disable react/no-unescaped-entities */
// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const App: React.FC = () => {
  const [playerID, setPlayerID] = useState("PLAYER123456789");
  const [isCopied, setIsCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: number; text: string; sender: string; time: string }>
  >([
    {
      id: 1,
      text: "হ্যালো! আপনার গেমিং অভিজ্ঞতা সম্পর্কে আজ কীভাবে আপনাকে সাহায্য করতে পারি?",
      sender: "agent",
      time: "10:05 AM",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const commonMessages = {
    account: [
      "আমি আমার অ্যাকাউন্টের তথ্য আপডেট করতে চাই।",
      "আমার অ্যাকাউন্ট কীভাবে ভেরিফাই করব?",
      "আমি আমার অ্যাকাউন্টে প্রবেশ করতে পারছি না।",
      "আমি আমার পাসওয়ার্ড পরিবর্তন করতে চাই।",
    ],
    payment: [
      "আমার উত্তোলন অনেকক্ষণ ধরে অপেক্ষমাণ রয়েছে।",
      "আমি এখনো আমার ডিপোজিট পাইনি।",
      "আপনারা কোন কোন পেমেন্ট পদ্ধতি গ্রহণ করেন?",
      "আমি আমার পেমেন্টের তথ্য আপডেট করতে চাই।",
    ],
    technical: [
      "গেমটি আমার স্ক্রিনে বারবার আটকে যাচ্ছে।",
      "গেম খেলার সময় ল্যাগ হচ্ছে।",
      "ওয়েবসাইটটি ঠিকমতো লোড হচ্ছে না।",
      "আমি আমার ডিভাইসে কিছু গেম অ্যাক্সেস করতে পারছি না।",
    ],
  };

  const faqs = [
    {
      question: "সর্বনিম্ন উত্তোলনের পরিমাণ কত?",
      answer:
        "সর্বনিম্ন উত্তোলনের পরিমাণ ২০ ডলার। আপনার পেমেন্ট পদ্ধতির ওপর নির্ভর করে উত্তোলন সম্পন্ন হতে বিভিন্ন সময় লাগতে পারে।",
    },
    {
      question: "ভেরিফিকেশন সম্পন্ন হতে কত সময় লাগে?",
      answer:
        "প্রয়োজনীয় সব ডকুমেন্ট জমা দেওয়ার পর সাধারণত অ্যাকাউন্ট ভেরিফিকেশন সম্পন্ন হতে ২৪-৪৮ ঘণ্টা সময় লাগে। ব্যস্ত সময়ে কিছুটা বেশি সময় লাগতে পারে।",
    },
    {
      question: "আমার ব্যক্তিগত তথ্য কি নিরাপদ?",
      answer:
        "হ্যাঁ, আপনার ব্যক্তিগত ও আর্থিক তথ্য সুরক্ষিত রাখতে আমরা আধুনিক এনক্রিপশন ও নিরাপত্তা ব্যবস্থা ব্যবহার করি। আপনার তথ্য অননুমোদিত তৃতীয় পক্ষের সঙ্গে শেয়ার করা হয় না।",
    },
    {
      question: "পাসওয়ার্ড ভুলে গেলে কী করব?",
      answer:
        "লগইন পেজে 'পাসওয়ার্ড ভুলে গেছেন' লিংকে ক্লিক করুন। পাসওয়ার্ড রিসেট করার নির্দেশনা ইমেইলে পাঠানো হবে। ইমেইল না পেলে স্প্যাম ফোল্ডার চেক করুন।",
    },
    {
      question: "বোনাস কীভাবে ক্লেইম করব?",
      answer:
        "বোনাস ক্লেইম করতে প্রমোশনস বিভাগে যান, আপনার পছন্দের বোনাস নির্বাচন করুন এবং নির্দেশনা অনুসরণ করুন। কিছু বোনাসের ক্ষেত্রে ডিপোজিট করার সময় বোনাস কোড প্রয়োজন হতে পারে।",
    },
    {
      question: "ওয়েজারিং রিকোয়ারমেন্ট কী?",
      answer:
        "প্রমোশন অনুযায়ী ওয়েজারিং রিকোয়ারমেন্ট ভিন্ন হতে পারে। সাধারণত উত্তোলনের আগে বোনাস ৩০-৪০ বার বেট করতে হয়। প্রতিটি প্রমোশনের নির্দিষ্ট শর্ত দেখে নিন।",
    },
    {
      question: "আমি কি মোবাইল ডিভাইসে খেলতে পারব?",
      answer:
        "হ্যাঁ, আমাদের প্ল্যাটফর্ম মোবাইল ডিভাইসের জন্য সম্পূর্ণ অপ্টিমাইজ করা। কোনো অ্যাপ ডাউনলোড ছাড়াই মোবাইল ব্রাউজার থেকে সব গেম ও ফিচার ব্যবহার করতে পারবেন।",
    },
    {
      question: "টেকনিক্যাল সমস্যার রিপোর্ট কীভাবে করব?",
      answer:
        "আপনি এই লাইভ চ্যাটে টেকনিক্যাল সমস্যার রিপোর্ট করতে পারেন অথবা সমস্যার বিবরণ ও সম্ভব হলে স্ক্রিনশটসহ support@igamingplatform.com ঠিকানায় ইমেইল করতে পারেন।",
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    // সাময়িক টুলটিপ বা নোটিফিকেশন দেখানো যেতে পারে
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* বাম কলাম - চ্যাট এবং প্লেয়ার তথ্য */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      লাইভ চ্যাট সাপোর্ট
                    </CardTitle>
                    <CardDescription className="text-gray-100 mt-1">
                      আমরা ২৪/৭ আপনাকে সাহায্য করতে প্রস্তুত
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-white/10 text-white border-0 px-3 py-1"
                  >
                    অনলাইন
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* প্লেয়ার আইডি */}
                <div className="bg-gray-50 p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">প্লেয়ার আইডি</p>
                      <p className="font-mono font-medium">{playerID}</p>
                    </div>
                    <TooltipProvider>
                      <Tooltip open={isCopied}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(playerID)}
                            className="!rounded-button whitespace-nowrap"
                          >
                            <i className="fas fa-copy mr-2"></i>
                            {isCopied ? "কপি হয়েছে!" : "আইডি কপি"}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>ক্লিপবোর্ডে কপি হয়েছে!</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* গুরুত্বপূর্ণ তথ্য */}
                <Alert className="m-4 bg-blue-50 border-blue-200">
                  <i className="fas fa-info-circle text-blue-500 mr-2"></i>
                  <AlertTitle>গুরুত্বপূর্ণ তথ্য</AlertTitle>
                  <AlertDescription>
                    আমাদের সাপোর্ট টিম বর্তমানে প্রচুর অনুরোধ পাচ্ছে।
                    সম্ভাব্য উত্তর দেওয়ার সময় ৫-১০ মিনিট।
                    আপনার ধৈর্যের জন্য ধন্যবাদ।
                  </AlertDescription>
                </Alert>

                {/* চ্যাট মেসেজ */}
              </CardContent>

              <CardFooter className="border-t p-4 !flex flex-col md:flex-row">
                <div className="space-y-6 w-full">
                  {/* সাধারণ মেসেজ */}
                  <Card className="shadow-lg border-0 !w-full">
                    <CardHeader>
                      <CardTitle>সাধারণ মেসেজ</CardTitle>
                      <CardDescription>
                        বহুল ব্যবহৃত মেসেজ কপি করতে ক্লিক করুন
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="account" className="w-full">
                        <TabsList className="grid grid-cols-3 mb-4">
                          <TabsTrigger
                            value="account"
                            className="!rounded-button whitespace-nowrap"
                          >
                            অ্যাকাউন্ট
                          </TabsTrigger>
                          <TabsTrigger
                            value="payment"
                            className="!rounded-button whitespace-nowrap"
                          >
                            পেমেন্ট
                          </TabsTrigger>
                          <TabsTrigger
                            value="technical"
                            className="!rounded-button whitespace-nowrap"
                          >
                            টেকনিক্যাল
                          </TabsTrigger>
                        </TabsList>

                        {Object.entries(commonMessages).map(
                          ([category, messages]) => (
                            <TabsContent
                              key={category}
                              value={category}
                              className="mt-0"
                            >
                              <div className="space-y-2">
                                {messages.map((msg, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                  >
                                    <p className="text-sm text-gray-700 mr-2">
                                      {msg}
                                    </p>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => copyMessage(msg)}
                                            className="!rounded-button whitespace-nowrap cursor-pointer"
                                          >
                                            <i className="fas fa-copy"></i>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>ক্লিপবোর্ডে কপি করুন</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                ))}
                              </div>
                            </TabsContent>
                          )
                        )}
                      </Tabs>
                    </CardContent>
                  </Card>

                  {/* সচরাচর জিজ্ঞাসিত প্রশ্ন */}
                  <Card className="shadow-lg border-0 w-full">
                    <CardHeader>
                      <CardTitle>সচরাচর জিজ্ঞাসিত প্রশ্ন</CardTitle>
                      <CardDescription>
                        সাধারণ প্রশ্নের দ্রুত উত্তর খুঁজুন
                      </CardDescription>
                      <div className="mt-2">
                        <div className="relative">
                          <Input
                            placeholder="প্রশ্ন খুঁজুন..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                          />
                          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[400px] pr-4">
                        <Accordion type="single" collapsible className="w-full">
                          {filteredFaqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                              <AccordionTrigger className="text-left hover:no-underline">
                                {faq.question}
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="pt-2 pb-4">
                                  <p className="text-gray-700">{faq.answer}</p>
                                  <div className="flex justify-end mt-2">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              copyMessage(faq.answer)
                                            }
                                            className="!rounded-button whitespace-nowrap cursor-pointer"
                                          >
                                            <i className="fas fa-copy mr-2"></i>
                                            উত্তর কপি করুন
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>ক্লিপবোর্ডে কপি করুন</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                          {filteredFaqs.length === 0 && (
                            <div className="py-8 text-center">
                              <i className="fas fa-search text-gray-300 text-4xl mb-3"></i>
                              <p className="text-gray-500">
                                "{searchQuery}" এর জন্য কোনো ফলাফল পাওয়া যায়নি
                              </p>
                              <p className="text-gray-400 text-sm mt-1">
                                অন্য শব্দ দিয়ে খুঁজুন অথবা সব প্রশ্ন দেখুন
                              </p>
                            </div>
                          )}
                        </Accordion>
                      </ScrollArea>
                    </CardContent>
                    <CardFooter className="border-t pt-4 flex justify-between">
                      <p className="text-sm text-gray-500">
                        আপনার প্রশ্নের উত্তর খুঁজে পাননি?
                      </p>
                      <Button
                        variant="link"
                        className="text-indigo-600 hover:text-indigo-800 p-0 h-auto !rounded-button whitespace-nowrap"
                        onClick={() => {
                          setMessage(
                            "আমি FAQ-তে আমার উত্তর খুঁজে পাইনি। আমার সাহায্য প্রয়োজন: "
                          );
                          document.querySelector("textarea")?.focus();
                        }}
                      >
                        চ্যাটে জিজ্ঞাসা করুন{" "}
                        <i className="fas fa-arrow-right ml-1"></i>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* ডান কলাম - দ্রুত মেসেজ এবং FAQ */}
        </div>
      </div>
    </div>
  );
};

export default App;