export const PROBLEMS = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "easy",
    tags: ["Array", "Hash Table"],
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
      { input: "nums = [3,3], target = 6", output: "[0,1]" },
    ],
    constraints: ["2 <= nums.length <= 10⁴", "-10⁹ <= nums[i] <= 10⁹", "-10⁹ <= target <= 10⁹", "Only one valid answer exists."],
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // Write your solution here\n  \n}\n\n// Test cases\nconsole.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]\nconsole.log(twoSum([3, 2, 4], 6));       // Expected: [1, 2]\nconsole.log(twoSum([3, 3], 6));          // Expected: [0, 1]`,
      python: `def two_sum(nums, target):\n    # Write your solution here\n    pass\n\n# Test cases\nprint(two_sum([2, 7, 11, 15], 9))  # Expected: [0, 1]\nprint(two_sum([3, 2, 4], 6))       # Expected: [1, 2]`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n}`,
    },
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "easy",
    tags: ["String", "Two Pointers"],
    description: "Write a function that reverses a string. The input string is given as an array of characters s.",
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
      { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' },
    ],
    constraints: ["1 <= s.length <= 10⁵", "s[i] is a printable ascii character."],
    starterCode: {
      javascript: `function reverseString(s) {\n  // Write your solution here (modify in-place)\n  \n}\n\n// Test cases\nlet s1 = ["h","e","l","l","o"];\nreverseString(s1);\nconsole.log(s1); // Expected: ["o","l","l","e","h"]`,
      python: `def reverse_string(s):\n    # Write your solution here (modify in-place)\n    pass`,
      java: `class Solution {\n    public void reverseString(char[] s) {\n        // Write your solution here\n    }\n}`,
    },
  },
  {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "easy",
    tags: ["String", "Two Pointers"],
    description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: "true", explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"', output: "false" },
      { input: 's = " "', output: "true" },
    ],
    constraints: ["1 <= s.length <= 2 * 10⁵", "s consists only of printable ASCII characters."],
    starterCode: {
      javascript: `function isPalindrome(s) {\n  // Write your solution here\n  \n}\n\nconsole.log(isPalindrome("A man, a plan, a canal: Panama")); // true\nconsole.log(isPalindrome("race a car")); // false`,
      python: `def is_palindrome(s):\n    # Write your solution here\n    pass`,
      java: `class Solution {\n    public boolean isPalindrome(String s) {\n        // Write your solution here\n        return false;\n    }\n}`,
    },
  },
  {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "medium",
    tags: ["Array", "Dynamic Programming"],
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
      { input: "nums = [1]", output: "1" },
      { input: "nums = [5,4,-1,7,8]", output: "23" },
    ],
    constraints: ["1 <= nums.length <= 10⁵", "-10⁴ <= nums[i] <= 10⁴"],
    starterCode: {
      javascript: `function maxSubArray(nums) {\n  // Write your solution here\n  \n}\n\nconsole.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // 6\nconsole.log(maxSubArray([5,4,-1,7,8])); // 23`,
      python: `def max_sub_array(nums):\n    # Write your solution here\n    pass`,
      java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}`,
    },
  },
  {
    id: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "medium",
    tags: ["Array", "Two Pointers", "Greedy"],
    description: "You are given an integer array height of length n. Find two lines that together with the x-axis form a container, such that the container contains the most water.",
    examples: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" },
      { input: "height = [1,1]", output: "1" },
    ],
    constraints: ["n == height.length", "2 <= n <= 10⁵", "0 <= height[i] <= 10⁴"],
    starterCode: {
      javascript: `function maxArea(height) {\n  // Write your solution here\n  \n}\n\nconsole.log(maxArea([1,8,6,2,5,4,8,3,7])); // 49`,
      python: `def max_area(height):\n    # Write your solution here\n    pass`,
      java: `class Solution {\n    public int maxArea(int[] height) {\n        // Write your solution here\n        return 0;\n    }\n}`,
    },
  },
  {
    id: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "medium",
    tags: ["Array", "Sorting"],
    description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals.",
    examples: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]." },
      { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]" },
    ],
    constraints: ["1 <= intervals.length <= 10⁴", "intervals[i].length == 2", "0 <= starti <= endi <= 10⁴"],
    starterCode: {
      javascript: `function merge(intervals) {\n  // Write your solution here\n  \n}\n\nconsole.log(merge([[1,3],[2,6],[8,10],[15,18]])); // [[1,6],[8,10],[15,18]]`,
      python: `def merge(intervals):\n    # Write your solution here\n    pass`,
      java: `class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Write your solution here\n        return new int[][]{};\n    }\n}`,
    },
  },
  {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "hard",
    tags: ["Array", "Two Pointers", "Dynamic Programming", "Stack"],
    description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    examples: [
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
      { input: "height = [4,2,0,3,2,5]", output: "9" },
    ],
    constraints: ["n == height.length", "1 <= n <= 2 * 10⁴", "0 <= height[i] <= 10⁵"],
    starterCode: {
      javascript: `function trap(height) {\n  // Write your solution here\n  \n}\n\nconsole.log(trap([0,1,0,2,1,0,1,3,2,1,2,1])); // 6\nconsole.log(trap([4,2,0,3,2,5])); // 9`,
      python: `def trap(height):\n    # Write your solution here\n    pass`,
      java: `class Solution {\n    public int trap(int[] height) {\n        // Write your solution here\n        return 0;\n    }\n}`,
    },
  },
];

export const DIFFICULTY_COLORS = {
  easy: "badge-easy",
  medium: "badge-medium",
  hard: "badge-hard",
};

export const LANGUAGES = ["javascript", "python", "java"];