
"use client";

import SiteHeader from "@/components/SiteHeader";
import { useGetBettingRecordQuery } from "@/lib/features/bettingRecord";

export default function BettingRecordsPage() {
  const { data, isLoading, isError } = useGetBettingRecordQuery({});

  return (
    <div className="container mx-auto ">
      <SiteHeader title="বেটিং সারসংক্ষেপ" />

      {/* লোডিং অবস্থা */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* এরর অবস্থা */}
      {isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          বেটিং রেকর্ড লোড করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।
        </div>
      )}

      {/* ডেটা প্রদর্শন */}
      {data && !isLoading && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-gray-500 text-sm font-medium">
                মোট বেট
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                ৳{data.totalBet.toFixed(2)}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-gray-500 text-sm font-medium">
                মোট জয়
              </h3>
              <p className="text-2xl font-bold text-green-600">
                ৳{data.totalWin.toFixed(2)}
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-gray-500 text-sm font-medium">
                জয়ের হার
              </h3>
              <p className="text-2xl font-bold text-purple-600">
                {data.winningRate.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
